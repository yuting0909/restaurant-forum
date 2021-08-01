const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

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