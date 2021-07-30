const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories(req, res) {
    return Category.findAll({ 
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        return Category.findByPk(req.params.id)
          .then(category => {
            return res.render('admin/categories', {
              categories: categories,
              category: category.toJSON()
            })
          })
      } 
      return res.render('admin/categories', { categories: categories })
    })
  },
  postCategory(req, res) {
    if (!req.body.name) {
      req.flash('error_messages', '名字不得為空')
      return res.redirect('back')
    } 
    return Category.create({
      name: req.body.name
    }).then((category) => {
      req.flash('success_messages', `新增${category.name}`)
      res.redirect('/admin/categories')
    })
  },
  updateCategory(req, res) {
    if (!req.body.name) {
      req.flash('error_messages', '名字不得為空')
      return res.redirect('back')
    } 
    return Category.findByPk(req.params.id).then(category => {
      category.update(req.body).then((category) => {
        req.flash('success_messages', `更新${category.name}`)
        res.redirect('/admin/categories')
      })
    })
  },
  deleteCategory(req, res) {
    return Category.findByPk(req.params.id).then(category => {
      category.destroy().then(category => {
        req.flash('success_messages', `已刪除${category.name}`)
        res.redirect('/admin/categories')
      })
    })
  }
}
module.exports = categoryController