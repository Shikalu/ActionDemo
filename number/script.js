// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initializeApples();
  updateCounts();
  initializeTouchEvents();
});

// 初始化触摸事件
function initializeTouchEvents() {
  const apples = document.querySelectorAll('.apple');
  apples.forEach(apple => {
    apple.addEventListener('touchstart', touchStart, { passive: false });
    apple.addEventListener('touchmove', touchMove, { passive: false });
    apple.addEventListener('touchend', touchEnd);
  });
}

// 触摸开始
function touchStart(event) {
  event.preventDefault();
  const touch = event.touches[0];
  const apple = event.target;
  const rect = apple.getBoundingClientRect();
  
  // 直接使用触摸点相对于苹果元素的偏移
  const touchOffsetX = touch.clientX - rect.left;
  const touchOffsetY = touch.clientY - rect.top;
  
  apple.dataset.touchOffsetX = touchOffsetX;
  apple.dataset.touchOffsetY = touchOffsetY;
  
  apple.classList.add('dragging');
}

function touchMove(event) {
  event.preventDefault();
  const touch = event.touches[0];
  const apple = event.target;
  
  if (apple.classList.contains('dragging')) {
    const touchOffsetX = parseFloat(apple.dataset.touchOffsetX) || 0;
    const touchOffsetY = parseFloat(apple.dataset.touchOffsetY) || 0;
    
    // 直接使用触摸点位置减去偏移量
    const left = touch.clientX - touchOffsetX;
    const top = touch.clientY - touchOffsetY;
    
    apple.style.position = 'absolute';
    apple.style.left = (left - document.documentElement.scrollLeft) + 'px';
    apple.style.top = (top - document.documentElement.scrollTop) + 'px';
    apple.style.zIndex = '9999';
    document.body.appendChild(apple);
    
    const initialTouchX = parseFloat(apple.dataset.initialTouchX);
    const initialTouchY = parseFloat(apple.dataset.initialTouchY);
    
    // 计算移动距离
    const moveDistance = Math.sqrt(
      Math.pow(touch.clientX - initialTouchX, 2) + 
      Math.pow(touch.clientY - initialTouchY, 2)
    );
    
    // 只有当移动距离超过阈值时才开始拖动
    if (moveDistance > 5) {
      if (apple.style.position !== 'fixed') {
        apple.style.position = 'fixed';
        apple.style.left = apple.dataset.initialLeft + 'px';
        apple.style.top = apple.dataset.initialTop + 'px';
        apple.style.zIndex = '1000';
      }
      
      const touchOffsetX = parseFloat(apple.dataset.touchOffsetX) || 0;
      const touchOffsetY = parseFloat(apple.dataset.touchOffsetY) || 0;
      
      const left = touch.clientX - touchOffsetX;
      const top = touch.clientY - touchOffsetY;
      
      apple.style.left = left + 'px';
      apple.style.top = top + 'px';
      
      const boxes = document.querySelectorAll('.box');
      boxes.forEach(box => {
        const rect = box.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
          box.style.borderColor = '#2196F3';
        } else {
          box.style.borderColor = '#4CAF50';
        }
      });
    }
  }
}

// 触摸结束
function touchEnd(event) {
  const apple = event.target;
  if (!apple.classList.contains('dragging')) return;
  
  apple.classList.remove('dragging');
  apple.style.position = '';
  apple.style.left = '';
  apple.style.top = '';
  apple.style.zIndex = '';
  
  const touch = event.changedTouches[0];
  const boxes = document.querySelectorAll('.box');
  let targetBox = null;
  
  boxes.forEach(box => {
    const rect = box.getBoundingClientRect();
    if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
        touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
      targetBox = box;
    }
    box.style.borderColor = '#4CAF50';
  });
  
  if (targetBox) {
    const applesContainer = targetBox.querySelector('#apples') || targetBox;
    applesContainer.appendChild(apple);
    updateCounts();
    
    apple.style.transform = 'scale(0.8)';
    setTimeout(() => {
      apple.style.transform = 'scale(1)';
    }, 200);
  }
}

// 初始化苹果元素
function initializeApples() {
  document.querySelectorAll('.apple').forEach((apple, index) => {
    apple.id = `apple-${index}`;
    apple.setAttribute('title', '拖拽我到其他盒子');
    apple.addEventListener('dragstart', dragStart);
    apple.addEventListener('dragend', dragEnd);
  });
}

// 允许放置
function allowDrop(event) {
  event.preventDefault();
  const box = event.currentTarget;
  box.style.borderColor = '#2196F3';
}

// 拖拽开始
function dragStart(event) {
  event.target.classList.add('dragging');
  event.dataTransfer.setData('appleId', event.target.id);
  event.dataTransfer.effectAllowed = 'move';
}

// 拖拽结束
function dragEnd(event) {
  event.target.classList.remove('dragging');
  document.querySelectorAll('.box').forEach(box => {
    box.style.borderColor = '#4CAF50';
  });
}

// 离开放置区域
function dragLeave(event) {
  event.currentTarget.style.borderColor = '#4CAF50';
}

// 放置处理
function drop(event) {
  event.preventDefault();
  const appleId = event.dataTransfer.getData('appleId');
  if (!appleId) return;

  let target = event.target;
  while (target && !target.classList.contains('box')) {
    target = target.parentElement;
  }

  if (target && target.classList.contains('box')) {
    const appleBeingDragged = document.getElementById(appleId);
    if (appleBeingDragged) {
      const applesContainer = target.querySelector('#apples') || target;
      applesContainer.appendChild(appleBeingDragged);
      updateCounts();
      
      // 添加动画效果
      appleBeingDragged.style.transform = 'scale(0.8)';
      setTimeout(() => {
        appleBeingDragged.style.transform = 'scale(1)';
      }, 200);
    }
  }

  // 重置边框颜色
  document.querySelectorAll('.box').forEach(box => {
    box.style.borderColor = '#4CAF50';
  });
}

// 更新计数器
function updateCounts() {
  const boxes = ['topBox', 'leftBottomBox', 'rightBottomBox'];
  boxes.forEach(boxId => {
    const box = document.getElementById(boxId);
    if (box) {
      const apples = box.querySelectorAll('.apple').length;
      const countElement = box.querySelector('span');
      if (countElement) {
        // 添加计数动画
        const currentCount = parseInt(countElement.textContent);
        if (currentCount !== apples) {
          countElement.style.transform = 'scale(1.2)';
          countElement.textContent = apples;
          setTimeout(() => {
            countElement.style.transform = 'scale(1)';
          }, 200);
        }
      }
    }
  });
}