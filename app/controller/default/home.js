"use strict";
const Controller = require("egg").Controller;

class HomeController extends Controller {
  async index() {
    const result = await this.app.mysql.get("blog_content", {});
    this.ctx.body = result;
  }
  async getArticleList() {
    const sql = `SELECT article.id as id,
    article.title as title,
    article.content as content,
    article.date as date,
    article.pic as pic,
    article.avatar as avatar,
    article.introduce as introduce,
    type.type as type,
    type.id as typeId 
    FROM article LEFT JOIN type ON article.type_id = type.Id 
    ORDER BY article.id DESC`;
    const results = await this.app.mysql.query(sql);
    this.ctx.body = { data: results };
  }

  async sign() {
    const { ctx, app } = this;
    const { username, password1, password2, avatarImg } = ctx.request.body;
    if (!username || !password1 || !password2) {
      ctx.body = { msg: "有数值为空" };
      return;
    }
    if (password1 !== password2) {
      ctx.body = { msg: "密码不同" };
      return;
    }
    const result = await app.mysql.insert("read_user", {
      username,
      password: password1,
      avatar: avatarImg,
    });
    console.log("===========", result);
    const insertSuccess = result.affectedRows === 1;
    if (insertSuccess) {
      const secret = "demo";
      const token = app.jwt.sign(
        {
          username, //需要存储的 token 数据
        },
        secret,
        { expiresIn: "1d" }
      );
      const insertId = result.insertId;
      ctx.body = {
        data: {
          token,
          username,
          avatar: avatarImg,
          userId: insertId,
        },
        insertId: insertId,
        status: 200,
      };
    } else {
      ctx.body = { msg: "注册失败" };
    }
  }

  async login() {
    const { ctx, app } = this;
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const secret = "demo";
    if (!username || !password) {
      ctx.body = { msg: "有数值为空" };
      return;
    }
    const sql = `SELECT * FROM read_user WHERE username = "${username}" AND password = "${password}"`;
    const result = await app.mysql.query(sql);
    if (result.length > 0) {
      const token = app.jwt.sign(
        {
          username: username, //需要存储的 token 数据
        },
        secret,
        { expiresIn: "1d" }
      );
      ctx.body = {
        data: {
          token: token,
          username: result[0].username,
          userId: result[0].id,
          avatar: result[0].avatar,
        },
        status: 200,
      };
    } else {
      ctx.body = { msg: "登录失败" };
    }
  }

  async avatar() {
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
    console.log('======',ctx.request.body)
    // 实现上传的 upload 接口
    // 图片以 base64 的方式传输
    try {
      const filename = `${Date.now()}${ctx.request.body.username}`;
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
  //添加评论
  async addComment() {
    const { app, ctx } = this;
    let comment = ctx.request.body;
    // tmpArticle.
    const result = await app.mysql.insert("comment", comment);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;
    ctx.body = {
      isScuccess: insertSuccess,
      insertId: insertId,
    };
  }
  async getComment() {
    const { app, ctx } = this;
    const sql = `SELECT comment,id,username,date,avatar FROM comment ORDER BY id DESC`;
    const results = await app.mysql.query(sql);
    ctx.body = { data: results };
  }
  async getPic() {
    const { app, ctx } = this;
    const sql = `SELECT picUrl,text,type,id FROM picture ORDER BY id DESC`;
    const results = await app.mysql.query(sql);
    ctx.body = { data: results };
  }
}

module.exports = HomeController;
