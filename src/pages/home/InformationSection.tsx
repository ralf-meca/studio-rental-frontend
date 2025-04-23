import * as React from 'react'
import {useState} from 'react'
import Typography from "@mui/material/Typography";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StraightenIcon from '@mui/icons-material/Straighten';
import PersonIcon from '@mui/icons-material/Person';
import {Divider, Link} from "@mui/material";
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import LocalDiningOutlinedIcon from '@mui/icons-material/LocalDiningOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useGetRentalsListData} from "../../shared/useGetRentalsListData.ts";

interface IInformationSectionProps {
}

const InformationSection: React.FC<IInformationSectionProps> = () => {
    const [isExpanded, setIsExpanded] = useState(false)
    const toggleContent = () => {
        setIsExpanded(!isExpanded)
    }

    const commodities = [
        "Chairs",
        "Sofa",
        "Fridge",
        "Coffee",
        "Bathroom",
        "Speakers",
        "Table",
        "Microwave",
        "Air conditioning",
        "Printer",
        "Wi-Fi",
        "Spotlights",
    ]

    const {rentalList} = useGetRentalsListData(true, false)

    return <>
        {/* Title */}
        <section>
        <Typography fontSize={30}>Best equipped studio for photoshooting in Tirana</Typography>
        <div className="d-flex my-2">
            <LocationOnIcon/>
            <Typography>Tirana, Albania</Typography>
        </div>
        <div className="d-flex mb-4">
            <div className="d-flex">
                <StraightenIcon color="disabled" style={{marginRight: "10px"}}/>
                <Typography color="gray">100 &#x33A1;</Typography>
            </div>
            <div className="d-flex">
                <PersonIcon color="disabled" style={{width: 20, margin: "0px 10px 0 10px"}}/>
                <Typography color="gray" fontSize={15}>6 guests</Typography>
            </div>
        </div>
        <Divider sx={{bgcolor: "secondary.light"}}/>
        </section>
        {/* About the venue */}
        <section>
            <Typography fontSize={25}>About the venue</Typography>
            <div>
                It is a unique space located on Tirana, Albania.
                Here you can do photo shoots, content creation, small and medium productions. It is a space with two
                floors, creating a double space (with a height of 2.70 to 5m) joined by a very characteristic
                staircase.
            </div>
            {isExpanded &&
                <div>
                    <div>
                        <div>
                            It has a large window and skylights generating natural light in all rooms.
                            You can differentiate 2 areas for shootings (beige zone and white zone with 4x5m cyclorama)
                            +
                            dressing
                            room.
                            We also have relaxation corners and a kitchen.

                            !!! Attention for filming, interviews and video recordings: the space is not
                            soundproofed,there
                            is
                            usually noise from time to time that can cause problems when recording sound.
                        </div>
                        <div>
                            ·············· INCLUDED IN THE RENTAL ·············
                        </div>
                    </div>
                    <div>
                        <div>
                            CONTINUOUS LIGHT:
                            ---------------------
                            - Aputure Pro 600 spotlight, 600W, (Bowens mount)
                            - Amaran 200D spotlight, 200W (Bowens mount)

                            FLASHES:
                            ---------------------
                            - 2x Metz flashes, 400W (Bowens mount)
                            - 4x wireless triggers

                            LIGHT MODIFIERS (all those with Bowens mount can be used for both continuous light
                            spotlights
                            and
                            flashes)
                            ---------------------
                            - Aputure Lightdome, d150cm (with honeycomb grid) (Bowens mount)
                            - Aputure Lightdome SE, d90cm (with honeycomb grid) (Bowens mount) Bowens)
                            - Aputure Lightbox,. 30x120cm (with honeycomb grid) (Bowens mount)
                            - White Godox umbrella with diffuser, d130cm
                            - SmallRig softbox, d55cm (with honeycomb grid)(Bowens mount)
                            - Rectangular softbox 50x70cm (Bowens mount)
                            - Standard reflector with 10/30/50º honeycomb grid (Bowens mount)
                            - Barn door with honeycomb grid (Bowens mount)
                            - Color gel filters (red, yellow, blue)

                            - Lastolite Skylite (diffuser, silver, white), 200x110cm
                            - 2x Lastolite Skylite foot clamps
                            - 3x Porex (black and white) 200x100cm with supports

                            - Colorama paper backgrounds 2.7m (white, beige, red, black, sky blue, thunder grey, dull
                            alluminium)
                            - Backgrounds for product photography (sizes, colours, textures on request)
                            - Fabrics (sizes, colours, textures on request)

                            - 1x Avenger A5036CS Roller 36 Low Base (156 cm - 360 cm, max load: 40 kg)
                            - 1x Avenger D650 Junior Boom Arm
                            - 1x C-stand Avenger A2030 KIT (tripod, extension arm and Grip-Head)
                            - 1x Background holder, up to 2.80m high and 3.85m wide.
                            - 4x Feet, Lastolite, 2.40m
                            - 2x Feet, 1.80m

                            - Manfrotto 075B tripod
                            - Manfrotto X-PRO MHXPRO-3WG ball head
                            - MANFROTTO 131DB horizontal arm (for overhead shots)

                            - 3x Cable extensions, 2x10m and 1x25m
                            - 2x Sandbags
                            - 2x Ladders

                            - Vertical steam iron, Rowenta Pro Style IS8460, 1800W
                            - 2x Stands with hangers
                            - 2x Large mirrors
                            - Furniture, plants and props
                            - Speaker
                        </div>

                    </div>
                </div>
            }
            {/* See More / See Less Button */}
            <Link onClick={toggleContent} className="see-more-link">
                {isExpanded ? 'See Less' : 'See More'}
                {isExpanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
            </Link>
            <Divider sx={{bgcolor: "secondary.light"}}/>
        </section>
        {/* Characteristics */}
        <section>
            <Typography fontSize={20} fontWeight={600}>Characteristics</Typography>
            <div className="d-flex m-2">
                <ChairOutlinedIcon style={{marginRight: "10px"}}/>
                <Typography fontSize={15} fontWeight={400}>Commodities</Typography>
            </div>
            <div className="row">
                <div className="col-6">
                    <ul>
                        {commodities?.slice(0, 5).map((commodity, index) => <li key={index}>{commodity}</li>)}
                    </ul>
                </div>
                <div className="col-6">
                    <ul>
                        {commodities?.slice(5, 10).map((commodity, index) => <li key={index}>{commodity}</li>)}
                    </ul>
                </div>
            </div>
        </section>
        {/* Catering and Drinks */}
        <section>
            <div className="d-flex m-2">
                <LocalDiningOutlinedIcon style={{marginRight: "10px"}}/>
                <Typography fontSize={15} fontWeight={400}>Catering and Drinks</Typography>
            </div>
            <div className="row">
                <div className="col-6">
                    <ul>
                        <li key={1}>Guest can bring his own food</li>
                        <li key={2} className="not-allowed">Venue can provide catering service</li>
                        <li key={3} className="not-allowed">Venue allows external refreshment drinks</li>
                    </ul>
                </div>
                <div className="col-6">
                    <ul>
                        <li key={4}>Venue allows external alcoholic drinks</li>
                        <li key={5} className="not-allowed">The venue only allows a list of selected caterers</li>
                    </ul>
                </div>
            </div>
            <Divider sx={{bgcolor: "secondary.light"}}/>
        </section>
        {/* Lights */}
        <section>
            <Typography fontSize={20} fontWeight={600} className="mt-4">Rentable Lights</Typography>
            {rentalList?.map((rental) => <div key={rental.name}>
                <div className="row mt-4">
                    <div className="col-3 d-flex justify-content-center">
                        <img src={`http://localhost:3001${rental?.image}`} alt={rental?.name} width={80} height="fit-content"/>
                    </div>
                    <div className="col-6">
                        <div className="row">
                            <div className="col-12">
                                <Typography fontSize={15} fontWeight={600}>{rental?.name}</Typography>
                            </div>
                            <div className="col-12">
                                <p style={{fontSize: 12, fontWeight: 400}}>{rental?.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="row light-price">
                            <div className="col-12">
                                <Typography fontSize={20} fontWeight={600}>{rental?.price}.00 &#8364;</Typography>
                            </div>
                            <div className="col-12">
                                per hour
                            </div>
                        </div>
                    </div>
                    <Divider sx={{bgcolor: "lightgray", marginTop: "15px"}}/>
                </div>
            </div>)}
        </section>
        {/* Map */}
        <section>
            <Typography fontSize={20} fontWeight={600} className="mt-4">Map</Typography>
            <div className="d-flex justify-content-center mb-4">
                <iframe
                    width="100%"
                    height="450"
                    style={{border: 0}}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                &q=Visual+Minds+Studio,Tiranë,Albania`}>
                </iframe>
            </div>
        </section>

    </>
}

export default InformationSection