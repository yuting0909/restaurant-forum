const db = require('../../models')
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
      return res.json({restaurants})
    })
  },
  getRestaurant(req, res) {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    }).then(restaurant => {
      return res.json({restaurant})
    })
  },
  postRestaurant(req, res) {
    if (!req.body.name) {
      return res.json({ status: 'error', message: '餐廳名字不得空白' })
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
            return res.json({ status: 'success', message: '餐廳成功建立' })
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
        return res.json({ status: 'success', message: '餐廳成功建立' })
      })
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.json({ status: 'success', message: '' })
          })
      })
  },
  getCategories(req, res) {
    return Category.findAll({ 
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        return Category.findByPk(req.params.id)
          .then(category => {
            return res.json({categories, category})
          })
      } 
      return res.json({categories})
    })
  }
}

module.exports = adminController