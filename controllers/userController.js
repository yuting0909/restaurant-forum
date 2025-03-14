const bcrypt = require('bcryptjs') 
const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const Followship = db.Followship

const userController = {
  signUpPage(req, res) {
    return res.render('signup')
  },
  signUp(req, res) {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同')
      return res.redirect('/signup')
    } else {
      User.findOne({where: {email: req.body.email}}).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage(req, res) {
    return res.render('signin')
  },
  signIn(req, res) {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout(req, res) {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  addFavorite(req, res) {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(() => {
      return res.redirect('back')
    })
  },
  removeFavorite(req, res) {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      favorite.destroy()
    }).then(() => {
      return res.redirect('back')
    })
  },
  getTopUsers(req, res) {
    return User.findAll({
      include: [{model: User, as: 'Followers'}]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUsers', {users})
    })
  },
  addFollowing(req, res) {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    }).then(() => {
      return res.redirect('back')
    })
  },
  removeFollowing(req, res) {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    }).then(followship => {
      followship.destroy()
    }).then(() => {
      return res.redirect('back')
    })
  }
}

module.exports = userController