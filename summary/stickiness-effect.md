# CSS 利用对比度和模糊属性实现粘性加载效果

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>stickiness-effect</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      .gooey {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 142px;
        height: 40px;
        margin: -20px 0 0 -71px;
        background: #fff;
        filter: contrast(20);
      }
      .gooey .dot {
        position: absolute;
        width: 16px;
        height: 16px;
        top: 12px;
        left: 15px;
        filter: blur(4px);
        background: #000;
        border-radius: 50%;
        transform: translateX(0);
        animation: dot 2.8s infinite;
      }
      .gooey .dots {
        transform: translateX(0);
        margin-top: 12px;
        margin-left: 31px;
        animation: dots 2.8s infinite;
      }
      .gooey .dots span {
        display: block;
        float: left;
        width: 16px;
        height: 16px;
        margin-left: 16px;
        filter: blur(4px);
        background: #000;
        border-radius: 50%;
      }
      @keyframes dot {
        50% {
          transform: translateX(96px);
        }
      }
      @keyframes dots {
        50% {
          transform: translateX(-31px);
        }
      }
    </style>
  </head>
  <body>
    <div class="gooey">
      <span class="dot"></span>
      <div class="dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </body>
</html>
```
