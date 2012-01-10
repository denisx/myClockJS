/*
 *
 * http://www.denisx.ru
 *
 */

var IndicatorClockArrow = function( p ){
	this.classText = '';
	var text;
	if ( p !== undefined ){
		text = 'classText';
		if ( p[text] !== undefined ){
			this[text] = p[text];
		}
	}
	this.html = '<div class="indicator-clock-arrow ' + this.classText + '"><div class="inside"></div></div>';
	if ( p !== undefined ){
		text = 'html';
		if ( p[text] !== undefined ){
			this[text] = p[text];
		}
	}
};

IndicatorClockArrow.prototype.init = function(){
	return this.html;
};





var IndicatorClock = function( p ){
	this.parent_container = null;
	this.hour_arrow_html = new IndicatorClockArrow( {classText: 'arrow-hour'} );
	this.minute_arrow_html = new IndicatorClockArrow( {classText: 'arrow-minute'} );
	this.second_arrow_html = new IndicatorClockArrow( {classText: 'arrow-second'} );
	this.finish_arrow_html = new IndicatorClockArrow( {classText: 'arrow-finish'} );
	this.container_html = '<div class="indicator-container"></div>';
	this.container = null;
	this.hour_arrow = null;
	this.minute_arrow = null;
	this.second_arrow = null;
	this.symbols = ['1','2','3','4','5','6','7','8','9','10','11','12'];
	this.symbols_show = true;
	this.segments = 110;
	this.segments_normal = {h:true,m:true,s:false};
	this.first_start = 0;
	this.on_first_start_init = false;
	this.browser = null;
	for( var i in p ){
		this[i] = p[i];
	}
};



IndicatorClock.prototype.init = function(){
	var t = this;
	if ( $.browser.msie && $.browser.version > 8 ){
		this.browser = 'ms';
	}
	if ( $.browser.webkit ){
		this.browser = 'webkit';
	}
	if ( $.browser.opera ){
		this.browser = 'o';
	}
	if ( $.browser.mozilla ){
		this.browser = 'moz';
	}
	if ( t.parent_container === null ) return false;
	var s = '';
	if ( t.hour_arrow_html !== null ){
		s += t.hour_arrow_html.init();
	}
	if ( t.minute_arrow_html !== null ){
		s += t.minute_arrow_html.init();
	}
	if ( t.second_arrow_html !== null ){
		s += t.second_arrow_html.init();
	}
	if ( t.finish_arrow_html !== null ){
		s += t.finish_arrow_html.init();
	}
	t.parent_container.html( t.parent_container.html() + t.container_html );
	this.container = $('.indicator-container',t.parent_container);
	this.segments_normal = {
		h: (t.segments>=100)
		, m: (t.segments%100 >= 10)
		, s: ((t.segments%100)%10 > 0)
	};
//	console.dir( t.segments, this.segments_normal );
	this.set_sector();
	if ( this.symbols_show ) this.set_symbols();
	this.container.html( this.container.html() + s );
	this.hour_arrow = $('.arrow-hour',this.container);
	this.minute_arrow = $('.arrow-minute',this.container);
	this.second_arrow = $('.arrow-second',this.container);
	this.finish_arrow = $('.arrow-finish',this.container);
	this.set_arrow_second(0,0);
	this.set_arrow_minute(0,0);
	this.set_arrow_hour(0,0);
};

IndicatorClock.prototype.set_symbols = function(){
	var t = this;
	var s = '';
	for (var i in t.symbols){
		s += '<div class="symbol" style="-'+t.browser+'-transform: rotate('+(i*30+30)+'deg); transform: rotate('+(i*30+30)+'deg);"><div style="-'+t.browser+'-transform: rotate('+(-(i*30+30))+'deg); transform: rotate('+(-(i*30+30))+'deg);">'+t.symbols[i]+'</div></div>';
	}
	this.container.html( this.container.html() + '<div class="container-symbols">' + s + '</div>');
};

IndicatorClock.prototype.set_sector = function(){
	var t = this;
	var s = '';
	for (var i=1; i<151; i++){
		var html_class = 'segment';
		if ( i%25 === 0 ){
			html_class += ' hour';
		}else{
			if ( i%5 === 0 ){
				html_class += ' min';
			}
		}
		var s_local = '<div class="'+html_class+'" style="-'+t.browser+'-transform: rotate('+(i*1.2)+'deg); transform: rotate('+(i*1.2)+'deg);"><div class="top"></div><div class="bottom"></div></div>';
		if ( i%25 === 0 && t.segments_normal.h ){
			s += s_local;
		}
		if ( i%5 === 0 && t.segments_normal.m ){
			s += s_local;
		}
		if ( t.segments_normal.s ){
			s += s_local;
		}
	}

	this.container.html( this.container.html() + '<div class="container-segment">' + s + '</div>');
};

IndicatorClock.prototype.set_arrow_second = function( sec, msec ){
	var t = this;
	t.arrow_change( t.second_arrow, (sec+msec/1000)*6 );
};


IndicatorClock.prototype.set_arrow_minute = function( min, sec ){
	var t = this;
	t.arrow_change( t.minute_arrow, (min+sec/60)*6 );
};

IndicatorClock.prototype.set_arrow_hour = function( h, min ){
	var t = this;
	var hours = h;
	hours = (hours>11)? hours-12: hours;
	t.arrow_change( t.hour_arrow, (hours+min/60)*(360*(2/24)) );
};

IndicatorClock.prototype.arrow_change = function(obj,n){
	var t = this;
	obj.css('-'+t.browser+'-transform','rotate('+n+'deg)');
	obj.css({
		'transform': 'rotate('+n+'deg)'
	});
};









var MyClockJS = function( p ){
	this.hours_a_day = 24;
	this.place = null;
	this.second_delay = 1000;
	this.name = 'my name';
	this.indicator = null;
	// to indicator
	this.symbols = null;
	this.symbols_show = null;
	this.segments = null;
//	this.arrow_hour = true;
//	this.arrow_minute = true;
//	this.arrow_second = false;
//	this.minutes = 60;

	var i;
	if ( p !== undefined ){
		if ( p.place !== undefined ){
			this.place = p.place;
		}
	}

	// try get user html parameters
	if ( this.place !== null ){
		var obj = this.place[0].attributes;
		for( i in obj ) {
			var attrName = obj[i].name;
			if ( attrName !== undefined ){
				var dataMatch = attrName.match(/^data-(.+)/);
				if ( dataMatch !== null ){
					var s = obj[i].value;
					var answer = s;
					if ( s === 'true' ){
						answer = true;
					}
					if ( s === 'false' ){
						answer = false;
					}
					if ( !isNaN( s ) ){
						answer = Number( s );
					}
					this[dataMatch[1]] = answer;
				}
			}
		}
	}
	// try get user js parameters
	for( i in p ){
		this[i] = p[i];
	}
};

MyClockJS.prototype.init = function(){
	var t = this;
	if ( t.place === null ) return false;
	this.indicator = new IndicatorClock({parent_container: t.place});
	if ( t.symbols !== null ){
		this.indicator.symbols = t.symbols.match(/[^,]+/g);
	}
	if ( t.symbols_show !== null ){
		this.indicator.symbols_show = t.symbols_show;
	}
	if ( t.segments !== null ){
		this.indicator.segments = t.segments;
	}
	this.indicator.init();
	this.start();
};

MyClockJS.prototype.start = function(){
	var t = this;
	var dt = new Date();
	setTimeout(function(){
		t.move_second();
		t.move_minute();
		t.move_hour();
	},1000-dt.getMilliseconds());
};

MyClockJS.prototype.move_second = function(){
	var t = this;
	var dt = new Date();
//	var nextRenderDelay = 1000-dt.getMilliseconds();
//	if ( t.second_delay !== 1000 ){
		var nextRenderDelay = (1000-dt.getMilliseconds()) % t.second_delay;
//	}
	setTimeout( function(){
		t.move_second();
	}, nextRenderDelay);
	t.indicator.set_arrow_second(dt.getSeconds(), dt.getMilliseconds());

};

MyClockJS.prototype.move_minute = function(){
	var t = this;
	var dt = new Date();
	setTimeout( function(){
		t.move_minute();
	}, 1000*(60/12));
	t.indicator.set_arrow_minute(dt.getMinutes(), dt.getSeconds());
};

MyClockJS.prototype.move_hour = function(){
	var t = this;
	var dt = new Date();
	setTimeout( function(){
		t.move_hour();
	}, 1000*60*(60/12));
	t.indicator.set_arrow_hour(dt.getHours(), dt.getMinutes());
};

MyClockJS.prototype.now = function(){
//	var dt_now = new Date();
	//console.log( dt_now. );
};



// global
var myClockJS = [];

// init all myClockJS on page
$('.myClockJS').each(function(){
	var myClock = new MyClockJS( { place: $(this) } );
	myClock.init();
	myClockJS.push( myClock );
});

//easeOutBack - с переливом немножко
