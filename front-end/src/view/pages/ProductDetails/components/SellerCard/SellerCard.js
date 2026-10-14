import React from "react";

import "./SellerCard.scss";

import {
    FaStore,
    FaUser,
    FaPhoneAlt,
    FaEnvelope,
    FaCheckCircle,
    FaShieldAlt
} from "react-icons/fa";



const SellerCard = ({ product }) => {


    const {

        business_name,
        owner_name,
        email,
        phone

    } = product;







    return (


        <section className="seller-card">





            <div className="seller-card__header">



                <div className="seller-card__icon">


                    <FaStore/>


                </div>





                <div>


                    <span>

                        Sold By

                    </span>


                    <h3>

                        {business_name}

                    </h3>


                </div>




            </div>









            <div className="seller-card__verified">


                <FaCheckCircle/>


                <span>

                    Verified Seller

                </span>


            </div>









            <div className="seller-card__details">





                <div className="seller-card__detail">


                    <FaUser/>


                    <div>

                        <span>
                            Owner
                        </span>


                        <strong>
                            {owner_name}
                        </strong>


                    </div>



                </div>









                <div className="seller-card__detail">


                    <FaEnvelope/>


                    <div>

                        <span>
                            Email
                        </span>


                        <strong>
                            {email}
                        </strong>


                    </div>



                </div>








                <div className="seller-card__detail">


                    <FaPhoneAlt/>


                    <div>

                        <span>
                            Contact
                        </span>


                        <strong>
                            {phone}
                        </strong>


                    </div>



                </div>







            </div>









            <div className="seller-card__trust">



                <FaShieldAlt/>



                <div>


                    <strong>
                        BuyRSell Mart Protection
                    </strong>


                    <p>

                        Secure buying experience with verified marketplace sellers.

                    </p>


                </div>



            </div>






        </section>


    );


};


export default SellerCard;