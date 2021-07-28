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
    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description
    }).then(restaurant => {
      req.flash('success_messages', '餐廳成功建立')
      res.redirect('/admin/restaurants')
    })
  }
}

module.exports = adminController