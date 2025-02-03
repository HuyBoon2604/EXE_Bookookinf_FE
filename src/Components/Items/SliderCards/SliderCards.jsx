import React, { useEffect, useRef, useState } from "react";
import "./SliderCards.css";
import Card from "../Card/Card"; // Ensure Card component is correctly imported
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";

import arduinoImage1 from '/src/assets/SliderCard/1.jpg';
import arduinoImage2 from '/src/assets/SliderCard/2.jpg';
import arduinoImage3 from '/src/assets/SliderCard/3.jpg';
import arduinoImage4 from '/src/assets/SliderCard/4.jpg';


const fakeData = [
    {
        title: "Arduino Project 1",
        description: "A basic Arduino setup with LED.",
        image: arduinoImage1,
    },
    {
        title: "Arduino Project 2",
        description: "A temperature monitoring system.",
        image: arduinoImage2,
    },
    {
        title: "Arduino Project 3",
        description: "An automated door locking system.",
        image: arduinoImage3,
    },
    {
        title: "Arduino Project 4",
        description: "A light intensity controller.",
        image: arduinoImage4,
    },
    {
        title: "Arduino Project 5",
        description: "A smart irrigation system.",
        image: arduinoImage1,
    },
    {
        title: "Arduino Project 6",
        description: "A security alarm system.",
        image: arduinoImage3,
    },
];

export default function SliderCards() {
    const [datasLength, setDataLength] = useState(fakeData.length);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const sliderRef = useRef(null);
    const slideLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollLeft -= 1080;
            checkScrollPosition();
        }
    };

    const slideRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollLeft += 1080;
            checkScrollPosition();
        }
    };

    const checkScrollPosition = () => {
        if (sliderRef.current) {
            const { scrollWidth, scrollLeft, clientWidth } = sliderRef.current;
            setIsAtStart(scrollLeft === 0);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
        }
    };

    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            slider.addEventListener("scroll", checkScrollPosition);
            checkScrollPosition();
        }
        return () => {
            if (slider) {
                slider.removeEventListener("scroll", checkScrollPosition);
            }
        };
    }, [datasLength]);

    return (
        <div id="slider-cards">
            {datasLength > 6 && (
                <div
                    className={`arrow left ${isAtStart ? "disabled" : ""}`}
                    onClick={!isAtStart ? slideLeft : null}
                >
                    <IoIosArrowRoundBack />
                </div>
            )}
            <div id="slider-cards-container" ref={sliderRef}>
                {fakeData.length > 0 ? (
                    fakeData.map((data, index) => <Card data={data} key={index} />)
                ) : (
                    <Stack direction="row" spacing={1} sx={{ display: "flex" }}>
                        <Skeleton
                            variant="rounded"
                            width={160}
                            height={280}
                            style={{ padding: "5px", margin: "0 10px" }}
                        />
                        <Skeleton
                            variant="rounded"
                            width={160}
                            height={280}
                            style={{ padding: "5px", margin: "0 10px" }}
                        />
                        <Skeleton
                            variant="rounded"
                            width={160}
                            height={280}
                            style={{ padding: "5px", margin: "0 10px" }}
                        />
                        <Skeleton
                            variant="rounded"
                            width={160}
                            height={280}
                            style={{ padding: "5px", margin: "0 10px" }}
                        />
                        <Skeleton
                            variant="rounded"
                            width={160}
                            height={280}
                            style={{ padding: "5px", margin: "0 10px" }}
                        />
                        <Skeleton
                            variant="rounded"
                            width={160}
                            height={280}
                            style={{ padding: "5px", margin: "0 10px" }}
                        />
                    </Stack>
                )}
            </div>
            {datasLength > 6 && (
                <div
                    className={`arrow right ${isAtEnd ? "disabled" : ""}`}
                    onClick={!isAtEnd ? slideRight : null}
                >
                    <IoIosArrowRoundForward />
                </div>
            )}
        </div>
    );
}
