<template>
  <svg
    width="380px"
    height="500px"
    viewBox="0 0 837 1045"
    class="transition"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
  >
    <g
      id="Page-1"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
      sketch:type="MSPage"
    >
      <path
        d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z"
        id="Polygon-1"
        stroke="#007FB2"
        stroke-width="6"
        sketch:type="MSShapeGroup"
      ></path>
      <path
        d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z"
        id="Polygon-2"
        stroke="#EF4A5B"
        stroke-width="6"
        sketch:type="MSShapeGroup"
      ></path>
      <path
        d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z"
        id="Polygon-3"
        stroke="#795D9C"
        stroke-width="6"
        sketch:type="MSShapeGroup"
      ></path>
      <path
        d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z"
        id="Polygon-4"
        stroke="#F2773F"
        stroke-width="6"
        sketch:type="MSShapeGroup"
      ></path>
      <path
        d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z"
        id="Polygon-5"
        stroke="#36B455"
        stroke-width="6"
        sketch:type="MSShapeGroup"
      ></path>
    </g>
  </svg>
  <div class="message-box">
    <div class="message-content transition">
      <h1>404</h1>
      <p>不存在该页面</p>
      <a href="/" class="link-button transition">回到首页</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
svg {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -250px;
  margin-left: -400px;
}
.message-box {
  height: 1px;
  width: 1px;
  position: absolute;
  top: 50%;
  left: 50%;
  .message-content {
    width: 120px;
    height: 160px;
    position: absolute;
    top: -130px;
    left: -60px;
    transform: translateX(140px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    h1 {
      font-size: 3rem;
    }
    p {
      font-size: 1.5rem;
    }
    .link-button {
      margin-top: 20px;
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 4px;
      background: #68c950;
      color: #fff;
      font-weight: bold;
      font-size: 14px;

      text-decoration: none;
      &:hover {
        filter: brightness(1.4);
        color: #000;
      }
    }
  }
}

@media (max-width: 980px) {
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -250px;
    margin-left: -190px;
  }
  .message-box .message-content {
    transform: translateX(0);
  }
}

#Polygon-1,
#Polygon-2,
#Polygon-3,
#Polygon-4,
#Polygon-5 {
  animation: float 1s infinite ease-in-out alternate;
}
@for $i from 1 to 5 {
  #Polygon-#{$i + 1} {
    $x: 0.2 * $i + 's';
    animation-delay: #{$x};
  }
}

@keyframes float {
  100% {
    transform: translateY(20px);
  }
}
</style>
