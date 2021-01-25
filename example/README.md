# Flask example

本地启动服务：

```bash
$ ENV=local python app.py
```

可以发现 `app.py` 中通过判断环境变量 `ENV` 为 `local` 才启动服务，云函数运行时就不会启动服务。
