const fs = require('fs')
const db = require('../models') 
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants(req, res) {
    return Restaurant.findAll({raw: true}).then(restaurants => {
      return res.render('admin/restaurants', {restaurants})
    })
  },
  createRestaurant(req, res) {
    return res.render('admin/create')
  },
  postRestaurant(req, res) {
    if (!req.body.name) {
      req.flash('error_messages', '餐廳名字不得空白')
      return res.redirect('back')
    }
    const { file } = req // equal to const file = req.file
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? `/upload/${file.originalname}` : null
          }).then((restaurant) => {
            req.flash('success_messages', '餐廳成功建立')
            return res.redirect('/admin/restaurants')
          })
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null
      }).then(restaurant => {
        req.flash('success_messages', '餐廳成功建立')
        res.redirect('/admin/restaurants')
      })
    }
    
  },
  getRestaurant(req, res) {
    return Restaurant.findByPk(req.params.id, {raw:true}).then(restaurant => {
      return res.render('admin/restaurant', {restaurant})
    })
  },
  editRestaurant(req, res) {
    return Restaurant.findByPk(req.params.id, {raw:true}).then(restaurant => {
      return res.render('admin/create', {restaurant} )
    })
  },
  updateRestaurant(req, res) {
    if (!req.body.name) {
      req.flash('error_messages', '餐廳名字不得空白')
      return res.redirect('back')
    }
    const {file} = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.findByPk(req.params.id).then(restaurant => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? `/upload/${file.originalname}` : restaurant.image
            }).then(restaurant => {
              req.flash('success_messages', '餐廳成功更新')
              res.redirect('/admin/restaurants')
            })
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
          image: restaurant.image
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