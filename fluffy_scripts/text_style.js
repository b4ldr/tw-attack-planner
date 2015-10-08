function textStyle (size,font,colour,bold,italic,sig) {
	var doc=(window.frames.length>1)?window.main.document:document;

	if(size) size = new Array("[size="+size+"]","[/size]"); else size = new Array("","");
	if(font) font = new Array("[font="+font+"]","[/font]"); else font = new Array("","");
	if(colour) colour = new Array("[color="+colour+"]","[/color]"); else colour = new Array("","");
	if(bold) bold = new Array("[b]","[/b]"); else bold = new Array("","");
	if(italic) italic = new Array("[i]","[/i]"); else italic = new Array("","");
	if(sig) sig = "\n__________________\n"+sig; else sig = "";

	var iframes = doc.getElementsByTagName("iframe");
	var frame;
	if(!iframes[0])frame=doc;
	else frame = (iframes[0].src.match(/forum.php/))?iframes[0].contentWindow.document:doc;
	var theMsg = frame.forms[0].message.value;
	frame.forms[0].message.value = size[0] + bold[0] + italic[0] + font[0] + colour[0] +  theMsg + colour[1] + font[1] + italic[1] + bold[1] + size[1] + sig;
	button = frame.forms[0].getElementsByTagName("input");
	button[button.length-1].click();
	}