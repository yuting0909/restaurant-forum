const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories(req, res) {
    return Category.findAll({ 
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/categories', {categories})
    })
  },
  postCategory(req, res) {
    if (!req.body.name) {
      req.flash('error_messages', '名字不得為空')
      return res.redirect('back')
    } 
    return Category.create({
      name: req.body.name
    }).then(() => res.redirect('/admin/categories'))
  }
}
module.exports = categoryController