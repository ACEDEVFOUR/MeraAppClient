
	var $actual = document.getElementById('actual');
    var $resize = document.getElementById('resized');
    $('#click').click(function () {
        readFile($actual.src, 'actualSize');
		writeData();
	});
	function writeData(){
        
        resize(115, $actual);
        compress($actual, 50, 115, 'jpeg', 'canvasresized');  
    }
    function resize(width,image) {
        width = width || 1000;
        var natW = image.naturalWidth;
        var natH = image.naturalHeight;
        var ratio = natH / natW;
        if (natW > width) {
            natW = width;
            natH = ratio * width;
        }

        $resize.width = natW;
        $resize.height = natH;

        $resize.src = image.src;
        readFile($resize.src, 'resizedSize');
    }


    function compress(source_img_obj, quality, maxWidth, output_format, id) {
        var mime_type = "image/jpeg";
        if (typeof output_format !== "undefined" && output_format == "png") {
            mime_type = "image/png";
        }

        maxWidth = maxWidth || 1000;
        var natW = source_img_obj.naturalWidth;
        var natH = source_img_obj.naturalHeight;
        var ratio = natH / natW;
        if (natW > maxWidth) {
            natW = maxWidth;
            natH = ratio * maxWidth;
        }

        var cvs = document.createElement('canvas');
        cvs.width = natW;
        cvs.height = natH;

        var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0, natW, natH);
        var newImageData = cvs.toDataURL(mime_type, quality / 100);
        $('#' + id).attr('src', newImageData);
        readFile(newImageData, 'canvasSize');
    }
 
    function readFile(fileUri, id) {

        var size = btoa(fileUri);
        $('#' + id).html((size.length / 1000) + " KB");
    }
   