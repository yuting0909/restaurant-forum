const fs = require('fs')
const db = require('../models') 
const Restaurant = db.Restaurant
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants(req, res) {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      console.log(restaurants)
      return res.render('admin/restaurants', {restaurants})
    })
  },
  createRestaurant(req, res) {
    Category.findAll({ 
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', {
        categories: categories
      })
    })
  },
  postRestaurant(req, res) {
    if (!req.body.name) {
      req.flash('error_messages', '餐廳名字不得空白')
      return res.redirect('back')
    }
    const { file } = req // equal to const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : null,
            CategoryId: req.body.categoryId
          }).then((restaurant) => {
            req.flash('success_messages', '餐廳成功建立')
            return res.redirect('/admin/restaurants')
          })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      }).then(restaurant => {
        req.flash('success_messages', '餐廳成功建立')
        res.redirect('/admin/restaurants')
      })
    }
  },
  getRestaurant(req, res) {
    return Restaurant.findByPk(req.params.id, {include: [Category]}).then(restaurant => {
      return res.render('admin/restaurant', {restaurant: restaurant.toJSON()})
    })
  },
  editRestaurant(req, res) {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories: categories, 
          restaurant: restaurant.toJSON()
        })
      })
    })
  },
  updateRestaurant(req, res) {
    if (!req.body.name) {
      req.flash('error_messages', '餐廳名字不得空白')
      return res.redirect('back')
    }
    const {file} = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then(restaurant => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            }).then(restaurant => {
              req.flash('success_messages', '餐廳成功更新')
              res.redirect('/admin/restaurants')
            })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: restaurant.image,
          CategoryId: req.body.categoryId
        }).then(restaurant => {
          req.flash('success_messages', '餐廳成功更新')
          res.redirect('/admin/restaurants')
        })
      })
    }
  },
  deleteRestaurant(req, res) {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      restaurant.destroy().then(() => {
        req.flash('success_messages', '成功刪除')
        res.redirect('/admin/restaurants')
      })
    })
  }
}

module.exports = adminController