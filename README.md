# Restaurant Forum
- 後端：Node.js / Express 建立 RESTful API，使用 MVC 架構開發
- 前端：connect-flash、express-handlebars、Bootstrap5
- 資料庫：MySQL，透過 Sequelize 語法操作資料庫
- 透過 Passport.js、express-session 實作登入驗證功能
- 額外設計前後端分離的 Web API 與 JWT 認證機制，並使用 Postman 測試 API
- 透過 Multer 實作上傳圖片功能
- 利用 faker.js 產生測試用資料
- 使用 Heroku 部署，部署資料庫為 ClearDB

## 專案介紹 (user story)
### 前台
- 使用者可以註冊/登入/登出網站
- 使用者可以在瀏覽所有餐廳與個別餐廳詳細資料
- 在瀏覽所有餐廳資料時，可以用分類篩選餐廳
- 使用者可以對餐廳留下評論
- 使用者可以收藏餐廳
- 使用者可以查看最新上架的 10 筆餐廳
- 使用者可以查看最新的 10 筆評論

### 後台
- 只有網站管理者可以登入網站後台
- 網站管理者可以在後台管理餐廳的基本資料
- 網站管理者可以在後台管理餐廳分類

## 操作說明
- 使用者需要有帳號才能瀏覽餐廳
- 測試帳號
  - 管理員 (email：root@example.com / password：12345678)
  - 使用者1 (email：user1@example.com / password：12345678)
  - 使用者2 (email：user2@example.com / password：12345678)
