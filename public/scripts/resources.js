// // banner slideshow

// let i = 0;
// let images = [];//empty array of images where it will be stored
// let time = 3000;//setting the time to 3 seconds or 3000 milliseconds

// //imageList
// images[0] = "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/rockcms/2023-02/302217-culver-city-homeless-mn-1015-897abc.jpg";
// images[1] = "https://images.unsplash.com/photo-1608342381036-15657da6bf58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG9tZWxlc3N8ZW58MHx8MHx8fDA%3D";
// images[2] = "https://images.unsplash.com/photo-1523847027398-d3eb27914c67?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvbWVsZXNzfGVufDB8fDB8fHww";
// images[3] = "https://plus.unsplash.com/premium_photo-1683141096869-b21fb229dd02?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvbWVsZXNzfGVufDB8fDB8fHww";
// images[4] = "https://media.istockphoto.com/id/1408430587/photo/food-drive-at-a-church.webp?b=1&s=170667a&w=0&k=20&c=V-_5i1Au0jHr2Geq0Xcu9aHz_w8ZwwJksDieyNuTOVg=";   


// function slideShow(){
//     document.slide.src = images[i];

//     if(i < images.length - 1){
//         i++;
//     }else{
//         i = 0;
//     }

//     setTimeout("slideShow()", time);
// // }/

// window.onload = function() {
//     slideShow();
// };

// let slideIndex = 0;
// showSlides();

// function showSlides() {
//     let i;
//     let slides = document.getElementsByClassName("slide");
//     let dots = document.getElementsByClassName("dot");
    
//     // Hide all slides
//     for (i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";
//     }

//     // Remove active class from all dots
//     for (i = 0; i < dots.length; i++) {
//         dots[i].classList.remove("active");
//     }

//     // Move to next slide
//     slideIndex++;

//     // Reset slideIndex if it exceeds number of slides
//     if (slideIndex > slides.length) {
//         slideIndex = 1;
//     }

//     // Display the current slide and set active dot
//     slides[slideIndex - 1].style.display = "block";
//     dots[slideIndex - 1].classList.add("active");

// }