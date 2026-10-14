import React, { useEffect, useMemo, useState } from "react";

import "./Gallery.scss";

import {
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";



const Gallery = ({
    images = [],
    productName,
    discount
}) => {


    const sortedImages = useMemo(() => {

        return [...images].sort(
            (a, b) =>
                a.display_order - b.display_order
        );

    }, [images]);


    const [activeImage, setActiveImage] = useState(
        sortedImages[0]?.image_url || ""
    );





    const [currentIndex, setCurrentIndex] = useState(0);


    useEffect(() => {

        setActiveImage(
            sortedImages[0]?.image_url || ""
        );

        setCurrentIndex(0);

    }, [images]);



    const changeImage = (image, index) => {


        setActiveImage(
            image.image_url
        );


        setCurrentIndex(index);


    };







    const nextImage = () => {


        if (!sortedImages.length) return;



        const next =
            (currentIndex + 1)
            %
            sortedImages.length;



        setCurrentIndex(next);


        setActiveImage(
            sortedImages[next].image_url
        );


    };








    const previousImage = () => {


        if (!sortedImages.length) return;



        const previous =
            (currentIndex - 1 + sortedImages.length)
            %
            sortedImages.length;



        setCurrentIndex(previous);


        setActiveImage(
            sortedImages[previous].image_url
        );


    };







    if (!sortedImages.length) {


        return (

            <div className="product-gallery product-gallery--empty">

                <p>
                    No product images available
                </p>

            </div>

        );


    }







    return (


        <div className="product-gallery">





            <div className="product-gallery__badge">


                {
                    Number(discount) > 0 &&

                    <span>

                        {discount}% OFF

                    </span>

                }


            </div>









            <div className="product-gallery__preview">



                <button

                    className="product-gallery__nav product-gallery__nav--left"

                    onClick={previousImage}
                    type="button"

                >

                    <FaChevronLeft />

                </button>







                <img

                    src={activeImage}

                    alt={productName || "Product Image"}

                    loading="lazy"

                />







                <button

                    className="product-gallery__nav product-gallery__nav--right"

                    onClick={nextImage}
                    type="button"

                >

                    <FaChevronRight />

                </button>



            </div>









            <div className="product-gallery__thumbnails">



                {

                    sortedImages.map((image, index) => (


                        <button

                            key={image.image_id}

                            className={

                                index === currentIndex

                                    ?

                                    "active"

                                    :

                                    ""

                            }

                            onClick={() => changeImage(image, index)}
                            type="button"

                        >


                            <img

                                src={image.image_url}

                                alt={productName || "Product Thumbnail"}

                                loading="lazy"

                            />


                        </button>


                    ))

                }



            </div>






        </div>


    );

};


export default Gallery;