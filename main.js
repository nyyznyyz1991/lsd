// Generated by CoffeeScript 1.9.2
(function() {
  var BG_COLOR, DOT_RADIUS, DOT_U, GRAVITY_Y, LINE_WIDTH, SQUARE_SIDE, VELOCITY_X, VELOCITY_Y, _ANIMATION_FRAME_ID_, _CTX_, _C_, _DEBUG_, _DOT_CTX_, _DOT_C_, _LINE_UPDATE_, _LOCATION_, _VCTX_, _VC_, _W_, applyGravityToDot, bounceDot, bounceLineNormal, copy, createLine, createRandomLine, d, distance, draw, drawDot, drawDots, drawLine, drawLines, drawSquare, drawTempLine, getInputCoordinates, getLineLength, initWorld, isDotLineCollison, isDotSquareCollision, isOutOfBounds, isSurrenderClicked, magnitude, makeDot, makeLine, makeSquare, makeVector, makeVectorByLine, moveDot, onDrawOut, placePoint, pointOnLineClosestToDot, ragnaroek, randomInt, resizeCanvas, setFinalLinePoint, setStartLinePoint, setTempLineEndPoint, stackToLine, surrender, tick, unitVector, update, updateDots, updateLines, vectorPointProduct, velocityBound, writeStuff;

  _DEBUG_ = false;

  _W_ = {};

  _ANIMATION_FRAME_ID_ = 0;

  VELOCITY_Y = 3.5;

  VELOCITY_X = 0;

  DOT_RADIUS = 3;

  DOT_U = 6;

  GRAVITY_Y = 0.0145;

  SQUARE_SIDE = 35;

  BG_COLOR = '#eee';

  LINE_WIDTH = 1;

  _LOCATION_ = window.document.body;

  _LINE_UPDATE_ = true;

  _VC_ = document.createElement('canvas');

  _VCTX_ = _VC_.getContext('2d');

  _VC_.style.backgroundColor = BG_COLOR;

  _C_ = document.createElement('canvas');

  _C_.style.backgroundColor = BG_COLOR;

  _CTX_ = _C_.getContext('2d');

  _DOT_C_ = document.createElement('canvas');

  _DOT_CTX_ = _DOT_C_.getContext('2d');

  _DOT_C_.id = 'dot_canvas';

  _DOT_C_.style.zIndex = _VC_.style.zIndex + 1;

  _DOT_C_.style.background = 'transparent';

  resizeCanvas = function() {
    var bounds;
    _VC_.style.position = _DOT_C_.style.position = 'absolute';
    if (_LOCATION_ === window.document.body) {
      bounds = {
        top: "0px",
        left: "0px",
        width: _LOCATION_.clientWidth,
        height: _LOCATION_.clientHeight
      };
    } else {
      bounds = _LOCATION_.getBoundingClientRect();
    }
    _VC_.width = _C_.width = _DOT_C_.width = bounds.width;
    _VC_.height = _C_.height = _DOT_C_.height = bounds.height;
    _VC_.style.top = _DOT_C_.style.top = bounds.top;
    return _VC_.style.left = _DOT_C_.style.left = bounds.left;
  };

  initWorld = function(wins, average_lines) {
    var k, ref, results;
    if (wins == null) {
      wins = 0;
    }
    if (average_lines == null) {
      average_lines = 0;
    }
    resizeCanvas();
    _W_.dots = [];
    _W_.lines = [];
    _W_.line_point_stack = [];
    _W_.h = _C_.height;
    _W_.w = _C_.width;
    _W_.time_since_last_circle = 0;
    _W_.square = makeSquare();
    _W_.dots.push(makeDot());
    _W_.end = false;
    _W_.won = false;
    _W_.pointer_down = false;
    _W_.temp_line_end_point = null;
    _W_.wins = wins;
    _W_.average_lines = Math.round(average_lines * 100) / 100;
    if (_W_.wins > 0) {
      results = [];
      for (k = 1, ref = _W_.wins; 1 <= ref ? k <= ref : k >= ref; 1 <= ref ? k++ : k--) {
        results.push(createRandomLine(_W_));
      }
      return results;
    }
  };

  d = function(msg) {
    if (_DEBUG_) {
      console.log(msg);
    }
    return msg;
  };

  copy = function() {
    return _VCTX_.drawImage(_C_, 0, 0);
  };

  window.startLsd = function(wins, average_lines, location) {
    if (wins == null) {
      wins = 0;
    }
    if (average_lines == null) {
      average_lines = 0;
    }
    if (location == null) {
      location = _LOCATION_;
    }
    _LOCATION_ = location;
    _LOCATION_.appendChild(_VC_);
    _LOCATION_.appendChild(_DOT_C_);
    initWorld(wins, average_lines);
    return tick();
  };

  tick = function() {
    if (!_W_.end) {
      _ANIMATION_FRAME_ID_ = requestAnimationFrame(tick);
      update(_W_);
      return draw(_W_, _CTX_);
    } else {
      ragnaroek(_W_);
      copy();
      return window.cancelAnimationFrame(_ANIMATION_FRAME_ID_);
    }
  };

  ragnaroek = function(world) {
    var av, wins;
    if (world.won === true) {
      drawSquare(world.square, _CTX_, true);
      wins = _W_.wins + 1;
      if (wins > 1) {
        av = (_W_.average_lines + _W_.lines.length) / 2;
      } else {
        av = _W_.lines.length;
      }
    } else {
      wins = _W_.wins - 1;
      if (wins < 0) {
        wins = 0;
      }
      av = _W_.average_lines;
    }
    drawDots(world.dots, _DOT_CTX_, BG_COLOR);
    if (_W_.end === true) {
      if (_W_.won === false) {
        return setTimeout(startLsd, 200, wins, av);
      } else {
        return setTimeout(startLsd, 1000, wins, av);
      }
    }
  };

  update = function(world) {
    world = updateDots(world);
    stackToLine(world.line_point_stack);
    return world;
  };

  draw = function(world, ctx) {
    drawDots(world.dots, _DOT_CTX_);
    if (_LINE_UPDATE_ === true) {
      _LINE_UPDATE_ = false;
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, world.w, world.h);
      drawLines(world.lines, ctx);
      drawSquare(world.square, ctx);
      drawTempLine(world, ctx);
      writeStuff(world, ctx);
      return copy();
    }
  };

  randomInt = function(min, max) {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  writeStuff = function(world, ctx) {
    ctx.fillStyle = "black";
    ctx.font = "12px Verdana";
    ctx.fillText("Level " + world.wins, 2, 12);
    ctx.fillText("Surrender", 2, 26);
    return drawLine([2, 28, 64, 28], ctx, false, 1);
  };

  makeDot = function(x, y) {
    var a;
    if (x == null) {
      x = Math.floor(_W_.w / 2);
    }
    if (y == null) {
      y = 10;
    }
    a = [x, y];
    a.velocity = {};
    a.velocity.x = VELOCITY_X;
    a.velocity.y = VELOCITY_Y;
    return a;
  };

  makeLine = function(x1, y1, x2, y2) {
    _LINE_UPDATE_ = true;
    return [x1, y1, x2, y2];
  };

  createLine = function(x1, y1, x2, y2, world) {
    if (world == null) {
      world = _W_;
    }
    return world.lines.push(makeLine(x1, y1, x2, y2));
  };

  createRandomLine = function(world) {
    var x1, x2, y1, y2;
    if (world == null) {
      world = _W_;
    }
    x1 = randomInt(0, _W_.w);
    y1 = randomInt(0 + 10, _W_.h);
    x2 = randomInt(0, _W_.w);
    y2 = randomInt(0 + 10, _W_.h);
    if (y1 < 40 && y2 < 40) {
      if (y1 <= y2) {
        y2 = randomInt(_W_.h / 2, _W_.h);
      } else {
        y1 = randomInt(_W_.h / 2, _W_.h);
      }
    }
    return createLine(x1, y1, x2, y2, _W_);
  };

  updateDots = function(world) {
    var dot, i, j, k, len, len1, line, m, ref, ref1;
    ref = world.dots;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      dot = ref[i];
      ref1 = world.lines;
      for (j = m = 0, len1 = ref1.length; m < len1; j = ++m) {
        line = ref1[j];
        if (isDotLineCollison(dot, line)) {
          bounceDot(dot, line);
        }
      }
      dot = moveDot(dot);
      if (isDotSquareCollision(dot, _W_.square)) {
        world.end = true;
        world.won = true;
      }
      if (isOutOfBounds(dot, world)) {
        world.end = true;
        world.won = false;
      }
    }
    return world;
  };

  updateLines = function(world) {
    return world;
  };

  drawDot = function(dot, dot_ctx, fill_style) {
    if (fill_style == null) {
      fill_style = "black";
    }
    dot_ctx.clearRect(dot[0] - 8, dot[1] - 8, 16, 16);
    dot_ctx.beginPath();
    dot_ctx.arc(dot[0], dot[1], DOT_RADIUS, 0, Math.PI * 2, true);
    dot_ctx.closePath();
    dot_ctx.strokeStyle = "black";
    dot_ctx.fillStyle = fill_style;
    dot_ctx.fill();
    return dot_ctx.stroke();
  };

  drawDots = function(dots, dot_ctx, fill_style) {
    var dot, k, len, results;
    if (dot_ctx == null) {
      dot_ctx = _DOT_CTX_;
    }
    if (fill_style == null) {
      fill_style = "black";
    }
    results = [];
    for (k = 0, len = dots.length; k < len; k++) {
      dot = dots[k];
      results.push(drawDot(dot, dot_ctx, fill_style));
    }
    return results;
  };

  drawLine = function(line, ctx, is_temp_line, line_width) {
    if (is_temp_line == null) {
      is_temp_line = false;
    }
    if (line_width == null) {
      line_width = LINE_WIDTH;
    }
    ctx.beginPath();
    ctx.moveTo(Math.floor(line[0]), Math.floor(line[1]));
    ctx.lineTo(Math.floor(line[2]), Math.floor(line[3]));
    ctx.lineWidth = line_width;
    if (!is_temp_line) {
      ctx.strokeStyle = "black";
    } else {
      ctx.strokeStyle = "red";
    }
    ctx.stroke();
    return ctx.strokeStyle = "black";
  };

  drawLines = function(lines, ctx) {
    var k, len, line, results;
    results = [];
    for (k = 0, len = lines.length; k < len; k++) {
      line = lines[k];
      results.push(drawLine(line, ctx));
    }
    return results;
  };

  drawTempLine = function(world, ctx) {
    var ref, ref1, sx, sy, tx, ty;
    if (world.pointer_down === true && world.line_point_stack[0] && world.temp_line_end_point) {
      ref = world.line_point_stack[0], sx = ref[0], sy = ref[1];
      ref1 = world.temp_line_end_point, tx = ref1[0], ty = ref1[1];
      return drawLine([sx, sy, tx, ty], ctx, true);
    }
  };

  makeSquare = function(x, y) {
    if (x == null) {
      x = randomInt(SQUARE_SIDE + 2, _W_.w - (SQUARE_SIDE + 2));
    }
    if (y == null) {
      y = randomInt(SQUARE_SIDE + 2, _W_.h - (SQUARE_SIDE + 2));
    }
    _LINE_UPDATE_ = true;
    return [x, y];
  };

  drawSquare = function(p, ctx, fill) {
    var x, y;
    if (ctx == null) {
      ctx = _CTX_;
    }
    if (fill == null) {
      fill = false;
    }
    x = p[0], y = p[1];
    ctx.rect(x, y, SQUARE_SIDE, SQUARE_SIDE);
    ctx.strokeStyle = "black";
    ctx.stroke();
    if (fill === true) {
      ctx.fillStyle = "black";
      return ctx.fill();
    }
  };

  distance = function(dot_a, dot_b) {
    var x, y;
    x = dot_a[0] - dot_b[0];
    y = dot_a[1] - dot_b[1];
    return Math.sqrt(x * x + y * y);
  };

  getLineLength = function(line) {
    return distance([line[0], line[1]], [line[2], line[3]]);
  };

  magnitude = function(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  };

  makeVector = function(dot_a, dot_b) {
    var vector;
    vector = {
      x: dot_b[0] - dot_a[0],
      y: dot_b[1] - dot_a[1]
    };
    return vector;
  };

  makeVectorByLine = function(l) {
    return makeVector([l[0], l[1]], [l[2], l[3]]);
  };

  unitVector = function(vector) {
    var r_vector, vector_magnitude;
    vector_magnitude = magnitude(vector);
    return r_vector = {
      x: vector.x / vector_magnitude,
      y: vector.y / vector_magnitude
    };
  };

  vectorPointProduct = function(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  };

  pointOnLineClosestToDot = function(dot, line) {
    var end_of_line_to_dot_vector, line_unit_vector, projection, r_point;
    line_unit_vector = unitVector(makeVectorByLine(line));
    end_of_line_to_dot_vector = makeVector([line[0], line[1]], dot);
    projection = vectorPointProduct(end_of_line_to_dot_vector, line_unit_vector);
    if (projection <= 0) {
      return [line[0], line[1]];
    }
    if (projection >= getLineLength(line)) {
      return [line[2], line[3]];
    }
    return r_point = [line[0] + line_unit_vector.x * projection, line[1] + line_unit_vector.y * projection];
  };

  isDotSquareCollision = function(dot, square) {
    var dx, dy, sx, sy;
    dx = dot[0], dy = dot[1];
    sx = square[0], sy = square[1];
    if (dx > sx && dx < sx + SQUARE_SIDE) {
      if (dy > sy && dy < sy + SQUARE_SIDE) {
        return true;
      }
    }
    return false;
  };

  isOutOfBounds = function(dot, world) {
    if (dot[1] > world.h + 3 || dot[0] < -3 || dot[0] > world.w + 3) {
      return true;
    } else {
      return false;
    }
  };

  isDotLineCollison = function(dot, line) {
    var closest, r;
    closest = pointOnLineClosestToDot(dot, line);
    r = distance(dot, closest) < DOT_RADIUS;
    return r;
  };

  moveDot = function(dot) {
    dot[0] = dot[0] + dot.velocity.x;
    dot[1] = dot[1] + dot.velocity.y;
    dot = applyGravityToDot(dot);
    return dot;
  };

  applyGravityToDot = function(dot) {
    dot.velocity.y = dot.velocity.y + GRAVITY_Y;
    dot = velocityBound(dot);
    return dot;
  };

  velocityBound = function(dot) {
    if (dot.velocity.y > VELOCITY_Y) {
      dot.velocity.y = VELOCITY_Y;
    }
    return dot;
  };

  bounceDot = function(dot, line) {
    var bounce_line_normal, dot_to_line_vector_product;
    bounce_line_normal = bounceLineNormal(dot, line);
    dot_to_line_vector_product = vectorPointProduct(dot.velocity, bounce_line_normal);
    dot.velocity.x = dot.velocity.x - (2 * dot_to_line_vector_product * bounce_line_normal.x);
    dot.velocity.y = dot.velocity.y - (2 * dot_to_line_vector_product * bounce_line_normal.y);
    dot = velocityBound(dot);
    return dot;
  };

  bounceLineNormal = function(dot, line) {
    var dot_to_closest_point_on_line_vector;
    dot_to_closest_point_on_line_vector = makeVector(pointOnLineClosestToDot(dot, line), dot);
    return unitVector(dot_to_closest_point_on_line_vector);
  };

  getInputCoordinates = function(e) {
    var ex, ey, rect, ref, ref1, ref2, x, y;
    rect = _VC_.getBoundingClientRect();
    ex = e.pageX || (e != null ? (ref = e.touches[0]) != null ? ref.clientX : void 0 : void 0);
    ey = e.pageY || (e != null ? (ref1 = e.touches[0]) != null ? ref1.clientY : void 0 : void 0);
    if (e.type === 'touchend') {
      ref2 = _W_.temp_line_end_point, ex = ref2[0], ey = ref2[1];
      _W_.temp_line_end_point = null;
    }
    x = ex - _VC_.offsetLeft;
    y = ey - _VC_.offsetTop;
    return [x, y];
  };

  placePoint = function(point, world) {
    return world.line_point_stack.push(point);
  };

  isSurrenderClicked = function(point, world) {
    var x, y;
    if (world == null) {
      world = _W_;
    }
    x = point[0], y = point[1];
    if (x < 64 && x > 2 && y > 2 && y < 28) {
      world = surrender();
      return true;
    }
    return false;
  };

  surrender = function(world) {
    if (world == null) {
      world = _W_;
    }
    world.end = true;
    world.won = false;
    return _W_;
  };

  setStartLinePoint = function(e) {
    var point;
    e.preventDefault();
    _W_.line_point_stack = [];
    point = getInputCoordinates(e);
    if (isSurrenderClicked(point) === false) {
      placePoint(point, _W_);
      return _W_.pointer_down = true;
    }
  };

  setFinalLinePoint = function(e) {
    var point;
    e.preventDefault();
    point = getInputCoordinates(e);
    placePoint(point, _W_);
    return _W_.pointer_down = false;
  };

  setTempLineEndPoint = function(e) {
    e.preventDefault();
    if (_W_.pointer_down === true) {
      _LINE_UPDATE_ = true;
      return _W_.temp_line_end_point = getInputCoordinates(e);
    }
  };

  onDrawOut = function(e) {
    e.preventDefault();
    return setFinalLinePoint(e);
  };

  stackToLine = function(stack) {
    var end_point, start_point;
    if (stack.length > 1) {
      end_point = stack.pop();
      start_point = stack.pop();
      return createLine(start_point[0], start_point[1], end_point[0], end_point[1]);
    }
  };

  _DOT_C_.addEventListener('mousedown', function(e) {
    return setStartLinePoint(e);
  });

  _DOT_C_.addEventListener('touchstart', function(e) {
    return setStartLinePoint(e);
  });

  _DOT_C_.addEventListener('mouseup', function(e) {
    return setFinalLinePoint(e);
  });

  _DOT_C_.addEventListener('touchend', function(e) {
    return setFinalLinePoint(e);
  });

  _DOT_C_.addEventListener('mousemove', function(e) {
    return setTempLineEndPoint(e);
  });

  _DOT_C_.addEventListener('touchmove', function(e) {
    return setTempLineEndPoint(e);
  });

  _DOT_C_.addEventListener('mouseout', function(e) {
    return onDrawOut(e);
  });

  _DOT_C_.addEventListener('touchleave', function(e) {
    return onDrawOut(e);
  });

  _DOT_C_.addEventListener('touchcancel', function(e) {
    return onDrawOut(e);
  });

  window.document.body.addEventListener('touchmove', function(e) {
    return e.preventDefault();
  });

  window.addEventListener('resize', function() {
    return surrender();
  }, false);

}).call(this);
