$(document).ready(function() {
	//Some variable setting
	windowHeight = $(window).height();
	windowWidth = $(window).width();
	
	//Right size
	$('#content').css('height',windowHeight).css('width',windowWidth);
	
	// To create a new note
	$("a#new-note").click(function() {
		//Random position
		noteTop = Math.floor(Math.random()*(windowHeight-200));
		noteLeft = Math.floor(Math.random()*(windowWidth-200));
		//random name
		noteName = "note_"+rndStr();
		//Default note
		data = '<div style="top: '+noteTop+'px; left: '+noteLeft+'px;" class="note" id="'+noteName+'"><div class="info mhandle"><a href="#" class="remove"><img src="remove.png" alt="X" /></a></div><textarea class="edit">Content</textarea><div class="rhandle"></div></div>';
		//Create note
		$('#content').append(data);
		//Apply moving & resize
		$('.note').animaDrag({ speed: 1, interval: 1, grip: '.mhandle' }); 
		$('.note').resizable({handler: '.rhandle', min: { width: 150, height: 150 },
		onStop: function(e) {
			saveNote($(e.data.resizeData.target));
		}
		});
		//Apply removing
		$("a.remove").click(function() {
			removeNote($(this).parent().parent());
			return false;
		});
		//Apply saves
		$(".info").mouseup(function(){
			saveNote($(this).parent());
		});
		$(".note").children('.edit').focusout(function() {
			saveNote($(this).parent());
		});
		//Save it to the cookie
		element = $("div[id='" + noteName + "']"); 
		saveNote(element);
		return false;
	});

	//Load all cookies to a array
	var cookies = get_cookies_array();
	//Loop thru the array
	for(var name in cookies) {
		//Replacing so that html tags work
		cookies[name] = cookies[name].replace("&lt;", "<");
		cookies[name] = cookies[name].replace("&gt;", ">");
		//Display note
		$('#content').append(cookies[name]);
	}
	
	//Apply deleting to all notes
	$("a.remove").click(function() {
		removeNote($(this).parent().parent());
		return false;
	});
	
	//Apply movement & resize to all notes
	$('.note').animaDrag({ speed: 1, interval: 1, grip: '.mhandle' }); 
	$('.note').resizable({handler: '.rhandle', min: { width: 150, height: 150 },
	onStop: function(e) {
		saveNote($(e.data.resizeData.target));
	}
	});
	
	// Saving after moving a note
	$(".info").mouseup(function(){
		saveNote($(this).parent());
	});
	
	//Save after focusing out of text field
	$(".note").children('.edit').focusout(function() {
		saveNote($(this).parent());
	});
	
	//Save just before moving away from page
	$(window).unload(function() {
		$('.note').each(function(index) {
			saveNote($(this));
		});
	});
	
	$('#search').children('.input').focus();
});

//Random string generator
function rndStr()
{
	// Define text var
    var text = "";
	//All the possible items in the name
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
	//Generate a 10 character name
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
	
	//Return it
    return text;
}

//Removing a note
function removeNote(element) {
	//Get the name for the cookie
	name = $(element).attr('id');
	//Delete cookie
	$.cookie(name, '');
	//Delete element
	$(element).remove();
}

//Saving note
function saveNote(element) {
	name = $(element).attr('id');
	$(element).find('.edit').replaceWith('<textarea class="edit">'+$(element).find('.edit').val()+'</textarea>');
	data = $(element).wrap('<div></div>').parent().html();
	$(element).unwrap();
	//Let's change the html tags to text
	data = data.replace("<", "&lt;");
	data = data.replace(">", "&gt;");
	//This cookie is saved for 7 years
	$.cookie(name, data, { expires: 30*12*7 });
}

//Cookie loop, thanks http://www.electrictoolbox.com/javascript-get-all-cookies/
function get_cookies_array() {
    var cookies = { };
    if (document.cookie && document.cookie != '') {
        var split = document.cookie.split(';');
        for (var i = 0; i < split.length; i++) {
            var name_value = split[i].split("=");
            name_value[0] = name_value[0].replace(/^ /, '');
			if(name_value[0].indexOf("note_") != -1) {
				cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
			}
        }
    }

    return cookies;
}

// Were going to ignore CTRL+S command, because I use it so damn much that it gets annoying that browser wants to save the page because of that
var isCtrl = false; 
$(document).keyup(function (e) {
	if(e.which == 17) {
		isCtrl = false;
	}
}).keydown(function (e) {
	if(e.which == 17) {
		isCtrl = true;
	}
	if(e.which == 83 && isCtrl == true) {
		return false;
	}
});


