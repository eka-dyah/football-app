function iconRandomGrey(color, id) {
    const img_list_grey = [
        '../img/grey_1.png',
        '../img/grey_2.png',
        '../img/grey_3.png',
        '../img/grey_4.png',
        '../img/grey_5.png',
        '../img/grey_6.png',
        '../img/grey_7.png',
        '../img/grey_8.png',
        '../img/grey_9.png',
    ];
    const img_list_color = [
        '../img/ball_color_1.png',
        '../img/ball_color_2.png',
        '../img/ball_color_3.png',
        '../img/ball_color_4.png',
        '../img/ball_color_5.png',
        '../img/ball_color_6.png'
    ];
    if (color == 'grey') {
        const randomNumber = Math.random(img_list_grey.length-1);
        document.getElementById(id).src = img_list_grey[randomNumber];
    }
    else {
        const randomNumber = Math.random(img_list_color.length-1);
        document.getElementById(id).src = img_list_color[randomNumber];
    }
    
}