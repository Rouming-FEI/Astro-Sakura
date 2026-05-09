将封面/背景图片放在此目录（png/jpg/webp）。

然后在站点配置 `src/config/site.ts` 的 `cover.images` 中添加：

```ts
cover: {
  randomPool: true,
  images: [
    '/images/cover/bg-1.png',
    '/images/cover/bg-2.png',
  ],
}
```

构建时会自动同步到 `public/images/cover/`。
