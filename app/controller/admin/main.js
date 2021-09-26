/* eslint-disable strict */
const Controller = require("egg").Controller;
const jsonwebtoken = require("jsonwebtoken");

class MainController extends Controller {
  async index() {
    // 首页的文章列表数据
    this.ctx.body = "hi api";
  }

  // 判断用户名密码是否正确
  async checkLogin() {
    const { ctx, app } = this;
    const userName = ctx.request.body.userName;
    const password = ctx.request.body.password;
    const secret = "demo";
    const token = jsonwebtoken.sign({ userName }, secret, { expiresIn: "1d" });
    const sql = `SELECT userName FROM admin_user WHERE userName = "${userName}" AND password = "${password}"`;
    const res = await app.mysql.query(sql);
    if (res.length > 0) {
      ctx.body = { data: "登录成功", token, userName };
    } else {
      ctx.body = { data: "登录失败" };
    }
  }
  // 后台文章分类信息
  async getTypeInfo() {
    const resType = await this.app.mysql.select("type");
    this.ctx.body = { data: resType };
  }
  //添加文章
  async addArticle() {
    let tmpArticle = this.ctx.request.body;
    // tmpArticle.
    const result = await this.app.mysql.insert("article", tmpArticle);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;

    this.ctx.body = {
      isScuccess: insertSuccess,
      insertId: insertId,
    };
  }
  //修改文章
  async updateArticle() {
    let tmpArticle = this.ctx.request.body;

    const result = await this.app.mysql.update("article", tmpArticle);
    const updateSuccess = result.affectedRows === 1;
    console.log(updateSuccess);
    this.ctx.body = {
      isScuccess: updateSuccess,
    };
  }

  //获得文章列表
  async getArticleList() {
    let sql = `SELECT article.id as id,
      article.title as title,
      article.introduce as introduce,
      article.date as addTime, 
      type.type as typeName  
      FROM article LEFT JOIN type ON article.type_id = type.Id 
      ORDER BY article.id DESC`;

    const resList = await this.app.mysql.query(sql);
    this.ctx.body = { list: resList };
  }

  //删除文章
  async delArticle() {
    let id = this.ctx.params.id;
    const res = await this.app.mysql.delete("article", { id: id });
    this.ctx.body = { data: res };
  }

  //根据文章ID得到文章详情，用于修改文章
  async getArticleById() {
    let id = this.ctx.params.id;

    let sql = `SELECT article.id as id,
    article.title as title,
    article.introduce as introduce,
    article.date as addTime, 
    article.pic as picture,
    article.avatar as avatar,
    article.content as content,
    type.type as typeName,
    type.id as typeId  
    FROM article LEFT JOIN type ON article.type_id = type.Id
    WHERE article.id = "${id}"`;
    const result = await this.app.mysql.query(sql);
    this.ctx.body = { data: result };
  }
  //获取评论
  async getComment() {
    const { app, ctx } = this;
    const sql = `SELECT comment,id,username,date,avatar FROM comment ORDER BY id DESC`;
    const results = await app.mysql.query(sql);
    ctx.body = { data: results };
  }
  //删除文章
  async delComment() {
    const { app, ctx } = this;
    let id = ctx.params.id;
    const res = await app.mysql.delete("comment", { id: id });
    this.ctx.body = { data: res };
  }
  //获取评论
  async getUser() {
    const { app, ctx } = this;
    const sql = `SELECT username,password,id,avatar FROM read_user ORDER BY id DESC`;
    const results = await app.mysql.query(sql);
    ctx.body = { data: results };
  }
  //删除文章
  async delUser() {
    const { app, ctx } = this;
    let id = ctx.params.id;
    const res = await app.mysql.delete("read_user", { id: id });
    this.ctx.body = { data: res };
  }
  //oss上传图片
  async addPic() {
    const { app, ctx } = this;
    // node 实现
    const OSS = require("ali-oss");
    const client = new OSS({
      // 连接OSS实例
      region: "oss-cn-beijing",
      accessKeyId: "LTAI4FfcYerCf1EJhH9opJJR",
      accessKeySecret: "A9CVMviMDLXPEkqFv1d8GftYHw1b3a",
      bucket: "my-site-avatar",
    });

    // 实现上传的 upload 接口
    // 图片以 base64 的方式传输
    try {
      const filename = `${Date.now()}${ctx.request.body.filename}`;
      const catalog = `/${filename}`;
      /* 此处的catalog指的是上传的文件存储在当前Bucket或Bucket下的指定目录 */
      const result = await client.put(
        catalog,
        Buffer.from(ctx.request.body.file, "base64")
      );
      ctx.body = {
        result,
      };
    } catch (e) {
      ctx.body = {
        result: false,
        errMsg: e,
      };
    }
  }
  async subPic() {
    const { app, ctx } = this;
    let tmpPicture = ctx.request.body;
    // tmpArticle.
    const result = await app.mysql.insert("picture", tmpPicture);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;
    ctx.body = {
      isScuccess: insertSuccess,
      insertId: insertId,
    };
  }
  async getPic() {
    const { app, ctx } = this;
    const sql = `SELECT picUrl,text,type,id FROM picture ORDER BY id DESC`;
    const results = await app.mysql.query(sql);
    ctx.body = { data: results };
  }
  async delPic() {
    const { app, ctx } = this;
    let id = ctx.params.id;
    const res = await app.mysql.delete("picture", { id: id });
    this.ctx.body = { data: res };
  }
}

module.exports = MainController;
