


/* SMIG v.2 - canvas drawing functions */


function prepareText(ctx,text, opts) {
  /*check options*/
  options = {
    width:opts.width||10,
    lineHeight:opts.lineHeight||64,
    fontSize:opts.fontSize||48,
    fontFamily:opts.fontFamily||'Helvetica',
    fontWeight:opts.fontWeight||'bold',
    textShadow:opts.textShadow||true,
    fillBackground: opts.fillBackground || '#ffffff',
    fillForeground: opts.fillForeground || '#000000',
    roundedCorners:opts.roundedCorners || 0
  }


  ctx.font = options.fontWeight+" " +  options.fontSize + "px " + options.fontFamily;



  var templine = '';
  var tempy = 0;
  var words = text.split(' ');
  var lines = [];

  for (var n = 0; n < words.length; n++) {
    var testLine  = templine + words[n] + ' ';
    var metrics   = ctx.measureText( testLine );
    var testWidth = metrics.width;

    if (testWidth > options.width && n > 0) {
      tempy += options.lineHeight;
      lines.push({
        text:templine,
        y:tempy-options.lineHeight,
        width:ctx.measureText(templine+' ').width
      });
      templine = words[n] + ' ';

    } else {
      templine = testLine;
      if (n+1==words.length) {
        lines.push({
          text:templine,
          y:tempy,
          width:ctx.measureText(templine+' ').width
        });
      }
    }
  }


  height = lines.length*options.lineHeight;


  return {
    lines:lines,
    width:options.width,
    height:height,
    options:options
  }

}



function renderText(ctx, info, opts) {
  var options = opts;
  for (var attrname in info.options) { options[attrname] = info.options[attrname]; }
  for (var i = 0; i < info.lines.length; i++) {
    ctx.beginPath();
    var line = info.lines[i];
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle=options.fillBackground;
    if (options.roundedCorners) {
      renderRoundRect(ctx, options.x, options.y+line.y,line.width,options.lineHeight, options.roundedCorner);
    } else {
      ctx.rect(options.x,options.y+line.y,line.width,options.lineHeight);
    }
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.font = options.fontWeight+" " +  options.fontSize + "px " + options.fontFamily;
    if (options.textShadow) {
        ctx.shadowColor = "rgba(0,0,0,0.2)"; /* TODO : add this option */
        ctx.shadowOffsetX = -3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 0;
    }
    ctx.fillStyle=options.fillForeground;
    //var verticalPadding = (options.lineHeight-options.fontSize)/2;
    ctx.fillText(line.text, options.x+7, options.y+line.y+options.lineHeight/2);
    ctx.shadowColor = "transparent";
    ctx.textBaseline = 'top';
    ctx.closePath();
  }
}


function renderBackgroundImage(ctx, image, opts) {
  var options = {
    width:opts.width||120,
    height:opts.height||120,
    imageWidth:image.width||120,
    imageHeight:image.height||120
  }
  var imHeight = 0;
  var imWidth = 0;
  var ratio = options.imageWidth/options.imageHeight;
  if ( (options.imageWidth<options.width || options.imageHeight<options.height) && ratio<1) {
    //height is bigger
    var imHeight = options.height;
    var imWidth = options.height*ratio;
    ctx.drawImage(image, (imWidth-options.width) / -2 , 0, imWidth, imHeight );
  } else if ( (options.imageWidth<options.width || options.imageHeight<options.height) && ratio>=1) {
    var imHeight = options.height
    var imWidth = options.height*ratio;;
    ctx.drawImage(image, (imWidth-options.width) / -2 , 0, imWidth, imHeight );
  } else {
    var imWidth=options.imageWidth;
    var imHeight=options.imageHeight;
    ctx.drawImage(image, (imWidth-options.width) / -2, (imHeight-options.height) / -2 );
  }
}


function renderRoundRect(ctx, x, y, width, height, radius) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  ctx.fill();
}

function renderCircleImage(ctx, image, opts) {
  var options = {
    x:opts.x||0,
    y:opts.y||0,
    size:opts.size||120,
  }
  ctx.beginPath();
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.arc(options.x+options.size/2, options.y+options.size/2, options.size/2+2, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.arc(options.x+options.size/2, options.y+options.size/2, options.size/2+6, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.closePath();

  ctx.save();
  ctx.beginPath();
  ctx.arc(options.x+options.size/2, options.y+options.size/2, options.size/2, 0, Math.PI * 2, false);
  ctx.clip();
  ctx.drawImage(image, options.x,options.y, options.size,options.size)
  // Undo the clipping
  ctx.restore();
}