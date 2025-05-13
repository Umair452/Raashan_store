import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import nodemailer from 'nodemailer';
import {
  isAuth,
  isAdmin,
  mailgun,
  payOrderEmailTemplate,
  isDeliveryBoy,
} from '../utils.js';

const orderRouter = express.Router();

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);
orderRouter.get(
  '/delivery',
  isAuth,
  isDeliveryBoy,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const ids = req.body.orderItems.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
    }));
    console.log(ids);

    for (const update of ids) {
      const productId = update._id;
      const quantity = update.quantity;

      try {
        // Find the product by its _id and update the stock
        const result = await Product.updateOne(
          { _id: productId },
          { $inc: { countInStock: -quantity } }
        );

        console.log(`Stock updated for product with _id ${productId}`);
        console.log(result);
      } catch (error) {
        console.error(
          `Error updating stock for product with _id ${productId}:`,
          error
        );
      }
    }
    const order = await newOrder.save();

    res.status(201).send({ message: 'New Order Created', order });
  })
);

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    const checkorders = await Order.find({}).populate('orderItems.product');

    let totalProfit = 0;

    for (const checkorder of checkorders) {
      for (const orderItem of checkorder.orderItems) {
        const product = orderItem.product;
        const profit =
          orderItem.quantity * (product.price - product.originalPrice);
        totalProfit += profit;
      }
    }

    console.log('Total Profit:', totalProfit);
    res.send({ users, orders, dailyOrders, productCategories, totalProfit });
  })
);
orderRouter.post(
  '/sales',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { month, year } = req.body;

    try {
      const salesData = await Order.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $year: '$createdAt' }, year] },
                { $eq: [{ $month: '$createdAt' }, month] },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$totalPrice' },
            totalOrders: { $sum: 1 },
          },
        },
      ]);

      if (salesData.length === 0) {
        res.json({ totalSales: 0 });
        return; // Return to prevent further execution
      }
      const startDate = new Date(year, month - 1, 1); // Month is 0-based in JavaScript Date object
      const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of the selected month

      const checkorders = await Order.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }).populate('orderItems.product');

      let totalProfit = 0;

      for (const checkorder of checkorders) {
        for (const orderItem of checkorder.orderItems) {
          const product = orderItem.product;
          const profit =
            orderItem.quantity * (product.price - product.originalPrice);
          totalProfit += profit;
        }
      }

      console.log('Total Profit:', totalProfit);

      // Send the total sales as the response
      res.json({
        totalSales: salesData[0].totalSales,
        totalOrders: salesData[0].totalOrders,
        totalProfit,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user');
    console.log(order);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      (order.isPaid = true), await order.save();
      const userEmail = order.user.email;
      console.log(userEmail);
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'princeawan092@gmail.com',
          pass: 'kusroxwjbvpowxvi',
        },
      });
      let mailOptions = {
        from: 'princeawan092@gmail.com',
        to: userEmail,
        subject: 'Invoice',
        html: payOrderEmailTemplate(order),
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      // mailgun()
      //   .messages()
      //   .send(
      //     {
      //       from: 'Amazona <amazona@mg.yourdomain.com>',
      //       to: `${order.user.name} <${order.user.email}>`,
      //       subject: `New order ${order._id}`,
      //       html: payOrderEmailTemplate(order),
      //     },
      //     (error, body) => {
      //       if (error) {
      //         console.log(error);
      //       } else {
      //         console.log(body);
      //       }
      //     }
      //   );

      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
orderRouter.delete(
  '/deliveryboy/:id',
  isAuth,
  isDeliveryBoy,
  expressAsyncHandler(async (req, res) => {
    console.log('am hit');
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
export default orderRouter;
