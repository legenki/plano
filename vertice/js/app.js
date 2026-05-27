/**
 * VERTICE - ГЛАВНЫЙ КОНТРОЛЛЕР ПРИЛОЖЕНИЯ
 * 
 * Объединяет логику отрисовки p5.js, обработку мыши и клавиатуры,
 * двустороннюю синхронизацию с сайдбаром параметров, Undo/Redo историю,
 * экспорт SVG/PNG и сериализацию проекта в формат JSON.
 */

// Глобальные переменные стилей и ограничений
let backgroundColor = "#ffffff";
let shapeColor = "#000000";
const corner_radiansMin = 12;
const corner_radiansMax = 150;
const corner_buttonRadians = 8;
const corner_buttonStrokeWeight = 1.5;

let strokeCapRounded = true;

// Параметры паттерна (сетки копий)
let pattern_visibility = true;
let pattern_alpha = 100;
let pattern_xOffset = 400;
let pattern_yOffset = 400;
let pattern_rotation = 0;

// Геометрия сцены
let scene_glyphs = [];
let selected_corner = null;
let selected_glyph = null;

// Трансформация холста
let scene_scale = 1;
let scene_center;
let scene_rotation = 0;

// Глобальная переменная для синхронного поворота всех глифов
let globalRotationValue = 0;

// Background reference image state
let bgImage = null;
let bgImageOpacity = 50;
let bgImageScale = 100;
let bgImageRotation = 0;
let bgImageX = 0;
let bgImageY = 0;

// Состояние экспорта
let exportActive = false;
let exportSVGActive = false;
let svgCanvas = null;

// Режимы редактирования: "corner" (вершины), "glyph" (глифы), "scene" (всей сцены)
let activeMode = "corner";

// Объект мыши с учетом масштаба и вращения сцены
let mouse;

// Ссылка на DOM элементы
let DOM = {};

// Глубокий буфер Undo/Redo
const maxUndoHistory = 20;
let undoHistory = [];

// Переменная для создания связи при двойном клике
let firstCornerToConnect = null;

// Флаги перетаскивания и смещения
let sceneDragging = false;
let sceneDragStart = null;
let patternDragStart = null;
let glyphDragStart = null;

// --- ИНИЦИАЛИЗАЦИЯ И СВЯЗЬ С ИНТЕРФЕЙСОМ ---

/**
 * Инициализация DOM-элементов при загрузке документа
 */
window.addEventListener("DOMContentLoaded", () => {
  // Кэширование элементов управления в сайдбаре
  DOM = {
    // Карточки
    cardCorner: document.getElementById("card-corner"),
    cardGlyph: document.getElementById("card-glyph"),
    
    // Ввод вершины
    inputVertexX: document.getElementById("input-vertex-x"),
    inputVertexY: document.getElementById("input-vertex-y"),
    slideVertexRadius: document.getElementById("slide-vertex-radius"),
    valVertexRadius: document.getElementById("val-vertex-radius"),
    
    // Ввод глифа
    inputGlyphDx: document.getElementById("input-glyph-dx"),
    inputGlyphDy: document.getElementById("input-glyph-dy"),
    slideGlyphRotation: document.getElementById("slide-glyph-rotation"),
    valGlyphRotation: document.getElementById("val-glyph-rotation"),
    
    // Глобальный поворот
    slideGlobalRotation: document.getElementById("slide-global-rotation"),
    valGlobalRotation: document.getElementById("val-global-rotation"),
    
    // Ввод паттерна
    checkPatternVisible: document.getElementById("check-pattern-visible"),
    slidePatternXOffset: document.getElementById("slide-pattern-x-offset"),
    valPatternXOffset: document.getElementById("val-pattern-x-offset"),
    slidePatternYOffset: document.getElementById("slide-pattern-y-offset"),
    valPatternYOffset: document.getElementById("val-pattern-y-offset"),
    slidePatternRotation: document.getElementById("slide-pattern-rotation"),
    valPatternRotation: document.getElementById("val-pattern-rotation"),
    slidePatternAlpha: document.getElementById("slide-pattern-alpha"),
    valPatternAlpha: document.getElementById("val-pattern-alpha"),
    
    // Стили и цвета
    checkStrokeRounded: document.getElementById("check-stroke-rounded"),
    pickerBgColor: document.getElementById("picker-bg-color"),
    pickerStrokeColor: document.getElementById("picker-stroke-color"),
    
    // Список слоев
    domLayersList: document.getElementById("dom-layers-list"),
    valLayersCount: document.getElementById("val-layers-count"),
    
    // Экспорт
    exportFilename: document.getElementById("export-filename"),
    
    // Background Reference Image Elements
    slideBgOpacity: document.getElementById("slide-bg-opacity"),
    valBgOpacity: document.getElementById("val-bg-opacity"),
    slideBgScale: document.getElementById("slide-bg-scale"),
    valBgScale: document.getElementById("val-bg-scale"),
    slideBgRotation: document.getElementById("slide-bg-rotation"),
    valBgRotation: document.getElementById("val-bg-rotation"),
    inputBgX: document.getElementById("input-bg-x"),
    inputBgY: document.getElementById("input-bg-y"),
    btnRemoveBgImage: document.getElementById("btn-remove-bg-image"),
    
    // Кнопки режимов
    btnModeCorner: document.getElementById("btn-mode-corner"),
    btnModeGlyph: document.getElementById("btn-mode-glyph"),
    btnModeScene: document.getElementById("btn-mode-scene")
  };

  // Инициализация скрытого инпута для загрузки JSON
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "import-json-file";
  fileInput.accept = ".json";
  fileInput.style.display = "none";
  fileInput.addEventListener("change", handleImportJSON);
  document.body.appendChild(fileInput);

  // Синхронизация начальных цветов
  updateUIColors();
  updateUISidebarVisibility();
});

/**
 * Переключение активного режима
 */
function setAppMode(mode) {
  activeMode = mode;
  
  // Обновление кнопок в UI
  [DOM.btnModeCorner, DOM.btnModeGlyph, DOM.btnModeScene].forEach(btn => btn.classList.remove("active"));
  
  if (mode === "corner") DOM.btnModeCorner.classList.add("active");
  if (mode === "glyph") DOM.btnModeGlyph.classList.add("active");
  if (mode === "scene") DOM.btnModeScene.classList.add("active");
  
  // Очистка выделений при смене режима на "Сцена"
  if (mode === "scene") {
    clearSelection();
  }

  showSnackbar(`Mode: ${mode === "corner" ? "Vertices" : mode === "glyph" ? "Glyphs" : "Scene"}`);
  updateUISidebarVisibility();
  updateLayersUI();
}

/**
 * Скрыть/показать карточки свойств в зависимости от выделения и режима
 */
function updateUISidebarVisibility() {
  if (!DOM.cardCorner || !DOM.cardGlyph) return;

  if (activeMode === "corner" && selected_corner) {
    DOM.cardCorner.style.display = "flex";
  } else {
    DOM.cardCorner.style.display = "none";
  }

  if (activeMode === "glyph" && selected_glyph) {
    DOM.cardGlyph.style.display = "flex";
  } else {
    DOM.cardGlyph.style.display = "none";
  }
}

/**
 * Синхронизация цветов в UI
 */
function updateUIColors() {
  if (DOM.pickerBgColor) {
    DOM.pickerBgColor.value = backgroundColor;
    let lbl = document.getElementById("label-bg");
    if (lbl) lbl.innerText = backgroundColor.toUpperCase();
  }
  if (DOM.pickerStrokeColor) {
    DOM.pickerStrokeColor.value = shapeColor;
    let lbl = document.getElementById("label-stroke");
    if (lbl) lbl.innerText = shapeColor.toUpperCase();
  }
}

// --- SETUP И DRAW (P5.JS CORE) ---

function setup() {
  const canvasContainer = document.getElementById("canvas-container");
  const canvas = createCanvas(canvasContainer.clientWidth, canvasContainer.clientHeight);
  canvas.parent("canvas-container");
  canvas.id("myCanvas");
  
  // Установка начального центра сцены в центр холста
  scene_center = createVector(width / 2, height / 2);
  mouse = createVector(0, 0);

  // Создание стартовой сцены (один глиф с парой вершин, чтобы приложение не было пустым)
  createInitialDemoScene();
  
  // Сохраняем начальное состояние
  saveHistoryState();
  updateLayersUI();
}

function draw() {
  // Вычисляем координаты мыши в локальной системе координат сцены
  calculateLocalMouse();

  background(backgroundColor);

  // Рендерим фоновое изображение (подложку)
  if (bgImage) {
    push();
    // Применяем общие трансформации сцены, чтобы подложка двигалась вместе со сценой
    translate(scene_center.x, scene_center.y);
    scale(scene_scale);
    rotate(scene_rotation);
    
    // Применяем индивидуальные трансформации фонового изображения
    translate(bgImageX, bgImageY);
    rotate(radians(bgImageRotation));
    scale(bgImageScale / 100);
    
    // Настраиваем прозрачность
    tint(255, bgImageOpacity * 2.55);
    
    // Рисуем по центру
    imageMode(CENTER);
    image(bgImage, 0, 0);
    pop();
  }

  // Рендерим сетку паттерна
  if (pattern_visibility) {
    drawPattern();
  }

  // Рендерим основную сцену
  push();
  translate(scene_center.x, scene_center.y);
  scale(scene_scale);
  rotate(scene_rotation);

  // Отрисовка всех геометрических глифов
  scene_glyphs.forEach(glyph => {
    glyph.drawScene();
  });

  // Отрисовка интерактивных точек выделения
  if (!exportActive) {
    scene_glyphs.forEach(glyph => {
      glyph.drawActiveButton();
    });
  }

  pop();
}

/**
 * Создание начальной красивой композиции при первом запуске
 */
function createInitialDemoScene() {
  const g = new Glyph();
  const c1 = new Corner(createVector(-150, -50), 60, g);
  const c2 = new Corner(createVector(150, 50), 30, g);
  const c3 = new Corner(createVector(0, 100), 45, g);
  
  g.addCorner(c1);
  g.addCorner(c2);
  g.addCorner(c3);
  g.connectCorners(c1, c2);
  g.connectCorners(c2, c3);
  
  scene_glyphs.push(g);
  
  // Делаем первую вершину активной по умолчанию
  selected_corner = c1;
  c1.setActive(true);
}

/**
 * Обработка ресайза окна браузера
 */
function windowResized() {
  const canvasContainer = document.getElementById("canvas-container");
  resizeCanvas(canvasContainer.clientWidth, canvasContainer.clientHeight);
  
  // Пересчитываем центр при ресайзе, чтобы центрировать сетку
  scene_center.set(width / 2, height / 2);
}

/**
 * Вычисление локальных координат мыши с учетом масштабирования и вращения сцены
 */
function calculateLocalMouse() {
  let m = createVector(mouseX - scene_center.x, mouseY - scene_center.y);
  m.div(scene_scale);
  m.rotate(-scene_rotation);
  mouse = m;
}

/**
 * Отрисовка сетки повторения паттерна
 */
function drawPattern() {
  // Для сетки копий рисуем копии со смещением вокруг центрального объекта
  const copiesX = 3;
  const copiesY = 3;

  // Сохраняем исходную прозрачность холста
  const originalAlpha = drawingContext.globalAlpha;
  
  // Применяем прозрачность паттерна к контексту рисования
  drawingContext.globalAlpha = pattern_alpha / 255;

  for (let x = -copiesX; x <= copiesX; x++) {
    for (let y = -copiesY; y <= copiesY; y++) {
      if (x === 0 && y === 0) continue; // Пропускаем центральный оригинал

      push();
      // Вычисляем вектор смещения паттерна с учетом поворота
      const offset = createVector(x * pattern_xOffset, y * pattern_yOffset);
      offset.rotate(pattern_rotation);

      // Применяем трансформацию всей сцены плюс смещение сетки
      translate(scene_center.x + offset.x, scene_center.y + offset.y);
      scale(scene_scale);
      rotate(scene_rotation);

      // Рисуем все глифы объединенным контуром без швов прямо на холсте
      scene_glyphs.forEach(glyph => {
        glyph.drawSceneMerged(drawingContext);
      });

      pop();
    }
  }

  // Восстанавливаем прозрачность холста
  drawingContext.globalAlpha = originalAlpha;
}

// --- УПРАВЛЕНИЕ МЫШЬЮ И ВВОД СОБЫТИЙ ---

function mousePressed() {
  // Игнорируем клики, если мы кликнули внутри боковой панели
  if (mouseX > width - document.getElementById("sidebar").clientWidth) return;

  calculateLocalMouse();

  if (activeMode === "corner") {
    let hitCorner = null;
    
    // Ищем, по какой вершине кликнули
    for (const glyph of scene_glyphs) {
      for (const corner of glyph.corners) {
        if (corner.checkHoverButton() || corner.checkHover()) {
          hitCorner = corner;
          break;
        }
      }
      if (hitCorner) break;
    }

    if (hitCorner) {
      // Выделяем вершину
      clearSelection();
      selected_corner = hitCorner;
      selected_corner.setActive(true);
      selected_corner.checkDrag();
      
      // Синхронизируем UI
      syncVertexToUI();
      updateUISidebarVisibility();
      updateLayersUI();
    } else {
      // Добавляем новую вершину, если кликнули на пустом месте
      const currentGlyph = selected_glyph || (scene_glyphs.length > 0 ? scene_glyphs[scene_glyphs.length - 1] : null);
      
      if (currentGlyph) {
        const newCorner = new Corner(mouse, 30, currentGlyph);
        
        // Связываем с предыдущей выделенной вершиной, если она была в этом же глифе
        const prevCorner = selected_corner;
        
        currentGlyph.addCorner(newCorner);
        
        if (prevCorner && prevCorner.glyph === currentGlyph) {
          currentGlyph.connectCorners(prevCorner, newCorner);
        }

        clearSelection();
        selected_corner = newCorner;
        selected_corner.setActive(true);
        
        saveHistoryState();
        syncVertexToUI();
        updateUISidebarVisibility();
        updateLayersUI();
        showSnackbar("Vertex added");
      } else {
        // Создаем новый глиф, если сцена вообще пуста
        const newGlyph = new Glyph();
        const newCorner = new Corner(mouse, 30, newGlyph);
        newGlyph.addCorner(newCorner);
        scene_glyphs.push(newGlyph);
        
        clearSelection();
        selected_corner = newCorner;
        selected_corner.setActive(true);
        selected_glyph = newGlyph;
        
        saveHistoryState();
        syncVertexToUI();
        updateUISidebarVisibility();
        updateLayersUI();
        showSnackbar("Glyph and vertex created");
      }
    }
  } 
  
  else if (activeMode === "glyph") {
    let hitGlyph = null;
    let hitCorner = null;
    
    for (const glyph of scene_glyphs) {
      for (const corner of glyph.corners) {
        if (corner.checkHover()) {
          hitGlyph = glyph;
          hitCorner = corner;
          break;
        }
      }
      if (hitGlyph) break;
    }

    if (hitGlyph) {
      clearSelection();
      selected_glyph = hitGlyph;
      selected_glyph.setActive(true);
      
      // Запоминаем точку начала перетаскивания глифа
      glyphDragStart = createVector(mouse.x, mouse.y);
      
      // Синхронизируем UI
      syncGlyphToUI();
      updateUISidebarVisibility();
      updateLayersUI();
    } else {
      clearSelection();
      updateUISidebarVisibility();
      updateLayersUI();
    }
  } 
  
  else if (activeMode === "scene") {
    // В режиме сцены перетаскиваем всю сцену или сетку паттерна (с Shift)
    if (keyIsDown(SHIFT)) {
      patternDragStart = createVector(mouseX, mouseY);
    } else {
      sceneDragging = true;
      sceneDragStart = createVector(mouseX - scene_center.x, mouseY - scene_center.y);
    }
  }
}

function mouseDragged() {
  calculateLocalMouse();

  if (activeMode === "corner" && selected_corner && selected_corner.dragging) {
    selected_corner.drag();
    syncVertexToUI();
  } 
  
  else if (activeMode === "glyph" && selected_glyph && glyphDragStart) {
    const dx = mouse.x - glyphDragStart.x;
    const dy = mouse.y - glyphDragStart.y;
    selected_glyph.translate(dx, dy);
    glyphDragStart.set(mouse.x, mouse.y);
  } 
  
  else if (activeMode === "scene") {
    if (keyIsDown(SHIFT) && patternDragStart) {
      const dx = mouseX - patternDragStart.x;
      const dy = mouseY - patternDragStart.y;
      
      pattern_xOffset += dx;
      pattern_yOffset += dy;
      
      patternDragStart.set(mouseX, mouseY);
      syncPatternToUI();
    } else if (sceneDragging && sceneDragStart) {
      scene_center.x = mouseX - sceneDragStart.x;
      scene_center.y = mouseY - sceneDragStart.y;
    }
  }
}

function mouseReleased() {
  if (selected_corner) {
    if (selected_corner.dragging) {
      selected_corner.endDrag();
      saveHistoryState();
    }
  }
  
  if (glyphDragStart) {
    glyphDragStart = null;
    saveHistoryState();
  }
  
  sceneDragging = false;
  sceneDragStart = null;
  patternDragStart = null;
}

/**
 * Обработка двойного клика для создания замыкания или нового глифа
 */
function doubleClicked() {
  if (mouseX > width - document.getElementById("sidebar").clientWidth) return;

  calculateLocalMouse();

  if (activeMode === "corner") {
    // Соединяем вершины при двойном клике на вершине
    let hitCorner = null;
    for (const glyph of scene_glyphs) {
      for (const corner of glyph.corners) {
        if (corner.checkHover()) {
          hitCorner = corner;
          break;
        }
      }
    }

    if (hitCorner) {
      if (!firstCornerToConnect) {
        // Запоминаем первую вершину
        firstCornerToConnect = hitCorner;
        showSnackbar("Select second vertex to connect");
      } else {
        // Соединяем со второй
        if (firstCornerToConnect !== hitCorner) {
          const g1 = firstCornerToConnect.glyph;
          const g2 = hitCorner.glyph;
          
          if (g1 === g2) {
            // Внутри одного глифа
            g1.connectCorners(firstCornerToConnect, hitCorner);
            showSnackbar("Vertices connected");
          } else {
            // Между разными глифами (слияние глифов!)
            g1.mergeGlyph(g2);
            g1.connectCorners(firstCornerToConnect, hitCorner);
            scene_glyphs = scene_glyphs.filter(g => g !== g2);
            showSnackbar("Glyphs merged and connected");
          }
          saveHistoryState();
          updateLayersUI();
        }
        firstCornerToConnect = null;
      }
    }
  } 
  
  else if (activeMode === "glyph") {
    // Двойной клик на пустом месте создает новый глиф
    let hitAny = false;
    for (const glyph of scene_glyphs) {
      for (const corner of glyph.corners) {
        if (corner.checkHover()) {
          hitAny = true;
          break;
        }
      }
    }

    if (!hitAny) {
      const newGlyph = new Glyph();
      const newCorner = new Corner(mouse, 40, newGlyph);
      newGlyph.addCorner(newCorner);
      scene_glyphs.push(newGlyph);
      
      clearSelection();
      selected_glyph = newGlyph;
      selected_glyph.setActive(true);
      selected_corner = newCorner;
      selected_corner.setActive(true);
      
      saveHistoryState();
      updateUISidebarVisibility();
      updateLayersUI();
      showSnackbar("New glyph created");
    }
  }
}

/**
 * Обработка скролла (мыши/тачпада) для изменения радиуса, масштаба или вращения
 */
function mouseWheel(event) {
  if (mouseX > width - document.getElementById("sidebar").clientWidth) return;

  calculateLocalMouse();
  const scaleSpeed = 0.05;

  if (activeMode === "corner") {
    // Скролл над вершиной меняет её радиус
    let hitCorner = null;
    for (const glyph of scene_glyphs) {
      for (const corner of glyph.corners) {
        if (corner.checkHover()) {
          hitCorner = corner;
          break;
        }
      }
    }

    if (hitCorner) {
      const radiusDelta = event.deltaY < 0 ? 5 : -5;
      hitCorner.setRadians(radiusDelta);
      syncVertexToUI();
      // Предотвращаем скролл страницы
      return false;
    }
  } 
  
  else if (activeMode === "glyph" && selected_glyph) {
    if (keyIsDown(SHIFT)) {
      // Shift + скролл вращает глиф вокруг центра
      const angleDelta = event.deltaY < 0 ? radians(5) : radians(-5);
      selected_glyph.rotate(angleDelta, mouse);
      syncGlyphToUI();
    } else {
      // Скролл масштабирует глиф
      const scaleDelta = event.deltaY < 0 ? 0.05 : -0.05;
      selected_glyph.scale(scaleDelta, mouse);
    }
    return false;
  } 
  
  else if (activeMode === "scene") {
    if (keyIsDown(SHIFT)) {
      // Shift + скролл над фоном вращает сетку паттерна
      const rotationDelta = event.deltaY < 0 ? radians(2) : radians(-2);
      pattern_rotation += rotationDelta;
      syncPatternToUI();
    } else {
      // Скролл меняет масштаб всей сцены
      const scaleFactor = event.deltaY < 0 ? (1 + scaleSpeed) : (1 - scaleSpeed);
      scene_scale = constrain(scene_scale * scaleFactor, 0.1, 10);
    }
    return false;
  }
}

// --- УПРАВЛЕНИЕ КЛАВИАТУРОЙ ---

function keyPressed() {
  // Игнорируем клавиатурный ввод, если курсор находится в текстовом поле или инпуте
  if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
    return;
  }

  // Горячие клавиши режимов: 1, 2, 3
  if (key === '1') { setAppMode('corner'); return; }
  if (key === '2') { setAppMode('glyph'); return; }
  if (key === '3') { setAppMode('scene'); return; }

  // Удаление выделенной вершины или глифа (Backspace/Delete)
  if (keyCode === BACKSPACE || keyCode === DELETE) {
    if (activeMode === "corner" && selected_corner) {
      deleteSelectedVertex();
    } else if (activeMode === "glyph" && selected_glyph) {
      deleteSelectedGlyph();
    } else if (activeMode === "scene") {
      appClearScene();
    }
    return false;
  }

  // Сетка копий по клавише X
  if (key === 'x' || key === 'X' || key === 'ч' || key === 'Ч') {
    pattern_visibility = !pattern_visibility;
    if (DOM.checkPatternVisible) DOM.checkPatternVisible.checked = pattern_visibility;
    showSnackbar(`Grid Pattern: ${pattern_visibility ? "ON" : "OFF"}`);
    return false;
  }

  // Ctrl+Z (Undo)
  if ((keyIsDown(CONTROL) || keyIsDown(91)) && (key === 'z' || key === 'Z' || key === 'я' || key === 'Я')) {
    appUndo();
    return false;
  }
}

// --- ФУНКЦИИ ИЗМЕНЕНИЯ ГЕОМЕТРИИ (КЛИКИ ИЗ UI) ---

/**
 * Очистить текущее выделение вершин и глифов
 */
function clearSelection() {
  selected_corner = null;
  selected_glyph = null;
  scene_glyphs.forEach(glyph => {
    glyph.setActive(false);
    glyph.corners.forEach(corner => corner.setActive(false));
  });
  firstCornerToConnect = null;
}

/**
 * Синхронизировать параметры выделенной вершины в UI
 */
function syncVertexToUI() {
  if (!selected_corner) return;
  if (DOM.inputVertexX) DOM.inputVertexX.value = Math.round(selected_corner.center.x);
  if (DOM.inputVertexY) DOM.inputVertexY.value = Math.round(selected_corner.center.y);
  if (DOM.slideVertexRadius) DOM.slideVertexRadius.value = selected_corner.radians;
  if (DOM.valVertexRadius) DOM.valVertexRadius.innerText = selected_corner.radians;
}

/**
 * Обновить параметры выделенной вершины из элементов UI
 */
function updateSelectedVertexFromUI() {
  if (!selected_corner) return;

  const newX = parseFloat(DOM.inputVertexX.value);
  const newY = parseFloat(DOM.inputVertexY.value);
  const newRadius = parseFloat(DOM.slideVertexRadius.value);

  if (!isNaN(newX)) selected_corner.center.x = newX;
  if (!isNaN(newY)) selected_corner.center.y = newY;
  
  selected_corner.radians = newRadius;
  if (DOM.valVertexRadius) DOM.valVertexRadius.innerText = newRadius;

  updateLayersUI();
}

/**
 * Удалить выделенную вершину
 */
function deleteSelectedVertex() {
  if (!selected_corner) return;
  
  const parentGlyph = selected_corner.glyph;
  parentGlyph.removeCorner(selected_corner);
  
  // Если у глифа не осталось вершин, удаляем и сам глиф
  if (parentGlyph.corners.length === 0) {
    scene_glyphs = scene_glyphs.filter(g => g !== parentGlyph);
  }

  clearSelection();
  saveHistoryState();
  updateUISidebarVisibility();
  updateLayersUI();
  showSnackbar("Vertex deleted");
}

/**
 * Разрезать глиф на две части в выделенной вершине
 */
function disconnectSelectedVertex() {
  if (!selected_corner) return;

  const parentGlyph = selected_corner.glyph;
  const newGlyph = parentGlyph.spliceAtCorner(selected_corner);
  
  if (newGlyph) {
    scene_glyphs.push(newGlyph);
    showSnackbar("Glyph split successfully");
  } else {
    showSnackbar("To split, the vertex must have exactly 2 links!");
  }

  clearSelection();
  saveHistoryState();
  updateUISidebarVisibility();
  updateLayersUI();
}

/**
 * Синхронизировать свойства выделенного глифа с UI
 */
function syncGlyphToUI() {
  if (!selected_glyph) return;
  if (DOM.slideGlyphRotation) DOM.slideGlyphRotation.value = 0;
  if (DOM.valGlyphRotation) DOM.valGlyphRotation.innerText = "0°";
}

/**
 * Сдвиг глифа из UI
 */
function translateSelectedGlyph(dx, dy) {
  if (!selected_glyph) return;
  selected_glyph.translate(parseFloat(dx || 0), parseFloat(dy || 0));
  saveHistoryState();
  updateLayersUI();
}

/**
 * Масштабирование глифа из UI
 */
function scaleSelectedGlyph(factor) {
  if (!selected_glyph || selected_glyph.corners.length === 0) return;
  
  // Берем в качестве опорной точки центр первой вершины глифа
  const pivot = selected_glyph.corners[0];
  selected_glyph.scale(factor, pivot);
  saveHistoryState();
}

/**
 * Вращение глифа из UI
 */
function rotateSelectedGlyphFromUI(angleDegrees) {
  if (!selected_glyph || selected_glyph.corners.length === 0) return;

  const angle = radians(parseFloat(angleDegrees));
  const pivot = selected_glyph.corners[0];
  
  // Сбрасываем к исходному состоянию перед вращением, вращаем на дельту
  // или просто применяем вращение от текущего значения слайдера
  if (DOM.valGlyphRotation) DOM.valGlyphRotation.innerText = `${angleDegrees}°`;
  
  // Для плавной регулировки вращаем от центральной точки глифа
  selected_glyph.rotate(radians(angleDegrees - (selected_glyph.lastRotationSliderVal || 0)), pivot);
  selected_glyph.lastRotationSliderVal = angleDegrees;
}

/**
 * Вращение всех глифов из UI
 */
function rotateAllGlyphsFromUI(angleDegrees) {
  const targetAngle = parseFloat(angleDegrees);
  const deltaDegrees = targetAngle - globalRotationValue;
  const deltaRad = radians(deltaDegrees);

  scene_glyphs.forEach(glyph => {
    if (glyph.corners.length > 0) {
      // Каждый глиф вращается вокруг своей первой вершины (локального центра)
      const pivot = glyph.corners[0];
      glyph.rotate(deltaRad, pivot);
    }
  });

  globalRotationValue = targetAngle;
  if (DOM.valGlobalRotation) DOM.valGlobalRotation.innerText = `${targetAngle}°`;
}

/**
 * Удалить выделенный глиф целиком
 */
function deleteSelectedGlyph() {
  if (!selected_glyph) return;

  scene_glyphs = scene_glyphs.filter(g => g !== selected_glyph);
  clearSelection();
  saveHistoryState();
  updateUISidebarVisibility();
  updateLayersUI();
  showSnackbar("Glyph deleted");
}

/**
 * Создать новый глиф из интерфейса пользователя (с кнопкой)
 */
function createNewGlyphFromUI() {
  const newGlyph = new Glyph();
  
  // Создаем начальную вершину в текущем центре видимой области холста
  const centerOfCanvas = createVector(width / 2 - scene_center.x, height / 2 - scene_center.y);
  centerOfCanvas.div(scene_scale);
  centerOfCanvas.rotate(-scene_rotation);

  const newCorner = new Corner(centerOfCanvas, 40, newGlyph);
  newGlyph.addCorner(newCorner);
  scene_glyphs.push(newGlyph);
  
  clearSelection();
  selected_glyph = newGlyph;
  selected_glyph.setActive(true);
  selected_corner = newCorner;
  selected_corner.setActive(true);
  
  setAppMode("corner"); // Переключаемся на редактирование вершины нового глифа
  
  saveHistoryState();
  updateUISidebarVisibility();
  updateLayersUI();
  showSnackbar("New glyph created at center");
}

// --- УПРАВЛЕНИЕ СЕТКОЙ ПАТТЕРНА (ИЗ UI) ---

function togglePatternVisible(visible) {
  pattern_visibility = visible;
}

function syncPatternToUI() {
  if (DOM.slidePatternXOffset) DOM.slidePatternXOffset.value = pattern_xOffset;
  if (DOM.valPatternXOffset) DOM.valPatternXOffset.innerText = Math.round(pattern_xOffset);
  
  if (DOM.slidePatternYOffset) DOM.slidePatternYOffset.value = pattern_yOffset;
  if (DOM.valPatternYOffset) DOM.valPatternYOffset.innerText = Math.round(pattern_yOffset);

  if (DOM.slidePatternRotation) DOM.slidePatternRotation.value = Math.round(degrees(pattern_rotation));
  if (DOM.valPatternRotation) DOM.valPatternRotation.innerText = `${Math.round(degrees(pattern_rotation))}°`;
}

function updatePatternFromUI() {
  pattern_xOffset = parseFloat(DOM.slidePatternXOffset.value);
  if (DOM.valPatternXOffset) DOM.valPatternXOffset.innerText = pattern_xOffset;

  pattern_yOffset = parseFloat(DOM.slidePatternYOffset.value);
  if (DOM.valPatternYOffset) DOM.valPatternYOffset.innerText = pattern_yOffset;

  const rotDeg = parseFloat(DOM.slidePatternRotation.value);
  pattern_rotation = radians(rotDeg);
  if (DOM.valPatternRotation) DOM.valPatternRotation.innerText = `${rotDeg}°`;

  pattern_alpha = parseFloat(DOM.slidePatternAlpha.value);
  if (DOM.valPatternAlpha) DOM.valPatternAlpha.innerText = pattern_alpha;
}

// --- ЦВЕТА И СТИЛИ (ИЗ UI) ---

function toggleStrokeCapRounded(rounded) {
  strokeCapRounded = rounded;
}

function updateColorsFromUI() {
  backgroundColor = DOM.pickerBgColor.value;
  shapeColor = DOM.pickerStrokeColor.value;
  
  let lblBg = document.getElementById("label-bg");
  if (lblBg) lblBg.innerText = backgroundColor.toUpperCase();
  let lblStroke = document.getElementById("label-stroke");
  if (lblStroke) lblStroke.innerText = shapeColor.toUpperCase();
  
  // Принудительно обновляем цвет заднего фона у контейнера canvas
  const canvasContainer = document.getElementById("canvas-container");
  if (canvasContainer) {
    canvasContainer.style.backgroundColor = backgroundColor;
  }
}

function setAppTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add("theme-dark");
    backgroundColor = "#1e1e1e";
    shapeColor = "#ffffff";
  } else {
    document.body.classList.remove("theme-dark");
    backgroundColor = "#ffffff";
    shapeColor = "#000000";
  }
  updateUIColors();
  updateColorsFromUI();
  showSnackbar(`Theme: ${theme === 'dark' ? "Dark" : "Light"}`);
  
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'THEME_CHANGED', theme: theme }, '*');
  }
}

// Parent communication listeners for Plano integration
window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;
  if (data.type === 'SYNC_THEME') {
    if (data.theme === 'dark') {
      document.body.classList.add("theme-dark");
      backgroundColor = "#1e1e1e";
      shapeColor = "#ffffff";
    } else {
      document.body.classList.remove("theme-dark");
      backgroundColor = "#ffffff";
      shapeColor = "#000000";
    }
    updateUIColors();
    updateColorsFromUI();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.altKey && (e.key === 'g' || e.key === 'v' || e.key === 's' || e.key === 'п' || e.key === 'м' || e.key === 'ы')) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'KEYDOWN_EVENT',
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        key: e.key,
        keyCode: e.keyCode
      }, '*');
    }
  }
});

// --- СПИСОК СЛОЕВ И ГЕОМЕТРИИ (ДЕРЕВО ОБЪЕКТОВ) ---

function updateLayersUI() {
  if (!DOM.domLayersList) return;
  DOM.domLayersList.innerHTML = "";

  DOM.valLayersCount.innerText = `Glyphs: ${scene_glyphs.length}`;

  if (scene_glyphs.length === 0) {
    DOM.domLayersList.innerHTML = `<div class="layer-item">Scene is empty</div>`;
    return;
  }

  scene_glyphs.forEach((glyph, glyphIndex) => {
    // Элемент глифа
    const glyphEl = document.createElement("div");
    glyphEl.className = `layer-item ${selected_glyph === glyph ? 'active' : ''}`;
    glyphEl.innerHTML = `
      <span>Glyph #${glyphIndex + 1}</span>
      <span class="vertex-count">Vertices: ${glyph.corners.length}</span>
    `;
    
    // Клик по глифу в списке выбирает его
    glyphEl.onclick = (e) => {
      e.stopPropagation();
      clearSelection();
      selected_glyph = glyph;
      selected_glyph.setActive(true);
      setAppMode("glyph");
      syncGlyphToUI();
      updateUISidebarVisibility();
      updateLayersUI();
    };

    DOM.domLayersList.appendChild(glyphEl);

    // Добавляем дочерние вершины с отступом
    glyph.corners.forEach((corner, cornerIndex) => {
      const cornerEl = document.createElement("div");
      cornerEl.className = `layer-item ${selected_corner === corner ? 'active' : ''}`;
      cornerEl.style.paddingLeft = "24px";
      cornerEl.style.borderLeft = "1px dashed var(--border-color)";
      
      const isConnected = glyph.connections.get(corner).length > 0;
      
      cornerEl.innerHTML = `
        <span>• Point #${cornerIndex + 1} (R: ${corner.radians})</span>
        <span class="vertex-count">
          ${isConnected ? 'Linked' : 'Single'}
        </span>
      `;

      cornerEl.onclick = (e) => {
        e.stopPropagation();
        clearSelection();
        selected_corner = corner;
        selected_corner.setActive(true);
        selected_glyph = glyph;
        setAppMode("corner");
        syncVertexToUI();
        updateUISidebarVisibility();
        updateLayersUI();
      };

      DOM.domLayersList.appendChild(cornerEl);
    });
  });
}

// --- UNDO / REDO И ОЧИСТКА ---

/**
 * Сохранить текущее состояние сцены в историю изменений
 */
function saveHistoryState() {
  const currentSceneCopy = scene_glyphs.map(glyph => glyph.copy());
  undoHistory.push(currentSceneCopy);
  
  if (undoHistory.length > maxUndoHistory) {
    undoHistory.shift();
  }
}

/**
 * Откат на один шаг назад (Undo)
 */
function appUndo() {
  if (undoHistory.length > 1) {
    undoHistory.pop(); // Удаляем текущее состояние
    const prevState = undoHistory[undoHistory.length - 1];
    
    // Восстанавливаем геометрию
    scene_glyphs = prevState.map(glyph => glyph.copy());
    
    clearSelection();
    updateUISidebarVisibility();
    updateLayersUI();
    showSnackbar("Undo");
  } else {
    showSnackbar("History is empty!");
  }
}

/**
 * Очистить всю сцену
 */
function appClearScene() {
  clearSelection();
  scene_glyphs = [];
  
  // Сброс глобального поворота
  globalRotationValue = 0;
  if (DOM.slideGlobalRotation) DOM.slideGlobalRotation.value = 0;
  if (DOM.valGlobalRotation) DOM.valGlobalRotation.innerText = "0°";

  saveHistoryState();
  updateUISidebarVisibility();
  updateLayersUI();
  showSnackbar("Scene cleared");
}

// --- ЭКСПОРТ (SVG / PNG) ---

function exportAsFormat(format) {
  const filename = DOM.exportFilename.value.trim() || "myGraphic";
  
  // Уведомляем систему рендеринга об экспорте
  exportActive = true;
  
  if (format === "SVG") {
    exportSVGActive = true;
    
    // Создаем SVG холст средствами p5.svg
    svgCanvas = createGraphics(width, height, SVG);
    svgCanvas.background(backgroundColor);
    
    // Отрисовываем сетку
    if (pattern_visibility) {
      const copiesX = 3;
      const copiesY = 3;
      for (let x = -copiesX; x <= copiesX; x++) {
        for (let y = -copiesY; y <= copiesY; y++) {
          if (x === 0 && y === 0) continue;
          
          svgCanvas.push();
          const offset = createVector(x * pattern_xOffset, y * pattern_yOffset);
          offset.rotate(pattern_rotation);
          svgCanvas.translate(scene_center.x + offset.x, scene_center.y + offset.y);
          svgCanvas.scale(scene_scale);
          svgCanvas.rotate(scene_rotation);
          
          const c = color(shapeColor);
          c.setAlpha(pattern_alpha);
          const originalShapeColor = shapeColor;
          shapeColor = c;
          
          scene_glyphs.forEach(glyph => glyph.drawScene());
          
          shapeColor = originalShapeColor;
          svgCanvas.pop();
        }
      }
    }
    
    // Отрисовываем оригинал в центре
    svgCanvas.push();
    svgCanvas.translate(scene_center.x, scene_center.y);
    svgCanvas.scale(scene_scale);
    svgCanvas.rotate(scene_rotation);
    
    scene_glyphs.forEach(glyph => glyph.drawScene());
    svgCanvas.pop();
    
    // Сохраняем SVG
    svgCanvas.save(`${filename}.svg`);
    
    exportSVGActive = false;
    svgCanvas = null;
    showSnackbar("Vector SVG exported!");
  } 
  
  else if (format === "PNG") {
    // Временно выключаем UI маркеры на один кадр
    redraw();
    saveCanvas(`${filename}`, 'png');
    showSnackbar("Raster PNG exported!");
  }
  
  exportActive = false;
}

// --- СЕРИАЛИЗАЦИЯ И ИМПОРТ/ЭКСПОРТ JSON ПРОЕКТОВ ---

/**
 * Сохранить проект в файл .json
 */
function saveProjectJSON() {
  const filename = (DOM.exportFilename.value.trim() || "project") + ".json";
  
  const projectData = {
    version: "1.0",
    backgroundColor: backgroundColor,
    shapeColor: shapeColor,
    strokeCapRounded: strokeCapRounded,
    pattern: {
      visibility: pattern_visibility,
      alpha: pattern_alpha,
      xOffset: pattern_xOffset,
      yOffset: pattern_yOffset,
      rotation: pattern_rotation
    },
    glyphs: scene_glyphs.map(glyph => {
      // Сохраняем вершины
      const cornersData = glyph.corners.map(corner => ({
        x: corner.center.x,
        y: corner.center.y,
        radians: corner.radians,
        scale: corner.scale
      }));

      // Сохраняем индексы связей
      const connectionsData = [];
      glyph.connections.forEach((neighbors, corner) => {
        const cIndex = glyph.corners.indexOf(corner);
        const nIndices = neighbors.map(n => glyph.corners.indexOf(n));
        connectionsData.push({
          cornerIndex: cIndex,
          neighborIndices: nIndices
        });
      });

      return {
        corners: cornersData,
        connections: connectionsData
      };
    })
  };

  // Скачивание файла
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  
  showSnackbar("Project saved!");
}

/**
 * Триггер диалогового окна выбора файла для импорта JSON
 */
function loadProjectJSON() {
  document.getElementById("import-json-file").click();
}

/**
 * Обработка и парсинг файла JSON
 */
function handleImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      
      // Загружаем глобальные стили
      if (data.backgroundColor) backgroundColor = data.backgroundColor;
      if (data.shapeColor) shapeColor = data.shapeColor;
      if (data.strokeCapRounded !== undefined) strokeCapRounded = data.strokeCapRounded;
      
      if (data.pattern) {
        pattern_visibility = data.pattern.visibility;
        pattern_alpha = data.pattern.alpha;
        pattern_xOffset = data.pattern.xOffset;
        pattern_yOffset = data.pattern.yOffset;
        pattern_rotation = data.pattern.rotation;
      }

      // Воссоздаем глифы
      const loadedGlyphs = [];
      data.glyphs.forEach(glyphData => {
        const glyph = new Glyph();
        
        // Воссоздаем вершины
        glyphData.corners.forEach(cData => {
          const corner = new Corner(createVector(cData.x, cData.y), cData.radians, glyph);
          corner.scale = cData.scale;
          glyph.addCorner(corner);
        });

        // Воссоздаем связи
        glyphData.connections.forEach(conn => {
          const mainCorner = glyph.corners[conn.cornerIndex];
          conn.neighborIndices.forEach(nIndex => {
            const neighborCorner = glyph.corners[nIndex];
            // Поскольку connections в классе двунаправленные, проверяем, чтобы не дублировать
            if (!glyph.isConnected(mainCorner, neighborCorner)) {
              glyph.connectCorners(mainCorner, neighborCorner);
            }
          });
        });

        loadedGlyphs.push(glyph);
      });

      // Перезаписываем сцену
      scene_glyphs = loadedGlyphs;
      clearSelection();
      
      // Сбрасываем историю на новое состояние
      undoHistory = [];
      saveHistoryState();

      // Сбрасываем глобальный поворот на 0, так как импортируется новая сцена
      globalRotationValue = 0;
      if (DOM.slideGlobalRotation) DOM.slideGlobalRotation.value = 0;
      if (DOM.valGlobalRotation) DOM.valGlobalRotation.innerText = "0°";

      // Синхронизируем UI элементы
      updateUIColors();
      updateColorsFromUI();
      syncPatternToUI();
      
      if (DOM.checkPatternVisible) DOM.checkPatternVisible.checked = pattern_visibility;
      if (DOM.checkStrokeRounded) DOM.checkStrokeRounded.checked = strokeCapRounded;
      if (DOM.slidePatternAlpha) DOM.slidePatternAlpha.value = pattern_alpha;
      
      updateUISidebarVisibility();
      updateLayersUI();
      
      showSnackbar("Project imported successfully!");
    } catch (err) {
      showSnackbar("Error reading JSON project file!");
      console.error(err);
    }
  };
  reader.readAsText(file);
  // Очищаем значение, чтобы можно было загрузить тот же файл повторно
  event.target.value = "";
}

// --- УТИЛИТЫ ИНТЕРФЕЙСА (СНАКБАР, МОДАЛКА) ---

function showSnackbar(message) {
  const snackbar = document.getElementById("snackbar");
  if (!snackbar) return;
  snackbar.innerText = message;
  snackbar.className = "show";
  
  // Убираем снаки через 2.5 секунды
  if (window.snackbarTimeout) clearTimeout(window.snackbarTimeout);
  window.snackbarTimeout = setTimeout(() => {
    snackbar.className = snackbar.className.replace("show", "");
  }, 2500);
}

function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "flex";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

// --- BACKGROUND IMAGE MANAGEMENT ---

function handleBgImageUpload(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    loadImage(dataUrl, img => {
      bgImage = img;
      
      // Показываем кнопку удаления
      if (DOM.btnRemoveBgImage) DOM.btnRemoveBgImage.style.display = "block";
      
      showSnackbar("Background image loaded successfully!");
      redraw();
    }, () => {
      showSnackbar("Failed to load image!");
    });
  };
  reader.readAsDataURL(file);
  
  // Сбрасываем значение инпута
  input.value = "";
}

function updateBgImageSettingsFromUI() {
  if (DOM.slideBgOpacity) {
    bgImageOpacity = parseFloat(DOM.slideBgOpacity.value);
    if (DOM.valBgOpacity) DOM.valBgOpacity.innerText = bgImageOpacity + "%";
  }
  
  if (DOM.slideBgScale) {
    bgImageScale = parseFloat(DOM.slideBgScale.value);
    if (DOM.valBgScale) DOM.valBgScale.innerText = bgImageScale + "%";
  }
  
  if (DOM.slideBgRotation) {
    bgImageRotation = parseFloat(DOM.slideBgRotation.value);
    if (DOM.valBgRotation) DOM.valBgRotation.innerText = bgImageRotation + "°";
  }
  
  if (DOM.inputBgX) {
    bgImageX = parseFloat(DOM.inputBgX.value) || 0;
  }
  
  if (DOM.inputBgY) {
    bgImageY = parseFloat(DOM.inputBgY.value) || 0;
  }

  redraw();
}

function removeBgImage() {
  bgImage = null;
  
  // Сбрасываем значения стейта
  bgImageOpacity = 50;
  bgImageScale = 100;
  bgImageRotation = 0;
  bgImageX = 0;
  bgImageY = 0;
  
  // Синхронизируем UI
  if (DOM.slideBgOpacity) DOM.slideBgOpacity.value = 50;
  if (DOM.valBgOpacity) DOM.valBgOpacity.innerText = "50%";
  if (DOM.slideBgScale) DOM.slideBgScale.value = 100;
  if (DOM.valBgScale) DOM.valBgScale.innerText = "100%";
  if (DOM.slideBgRotation) DOM.slideBgRotation.value = 0;
  if (DOM.valBgRotation) DOM.valBgRotation.innerText = "0°";
  if (DOM.inputBgX) DOM.inputBgX.value = 0;
  if (DOM.inputBgY) DOM.inputBgY.value = 0;
  
  // Скрываем кнопку удаления
  if (DOM.btnRemoveBgImage) DOM.btnRemoveBgImage.style.display = "none";
  
  showSnackbar("Background image removed.");
  redraw();
}
