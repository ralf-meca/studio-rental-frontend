import React from 'react'
import loaderGif from './../../assets/brand/animated2.mp4'
import {CircularProgress} from "@mui/material";

export const ApplicationSpinner: React.FC = () => <div style={{
    position: 'relative',
    display: 'inline-block'
}}>
    <video
        src={loaderGif}
        autoPlay
        loop
        muted
        style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute'
        }}
    />
    <CircularProgress variant="indeterminate" color="info" size={150} thickness={0} disableShrink/>
</div>

    // <>
    //         <h1>test test test</h1>


const SuspenseFallback = () => <div className="row" style={{height: '100vh'}}>
    <div className="col-12 d-flex align-items-center justify-content-center">
        <ApplicationSpinner/>
    </div>
</div>
export default SuspenseFallback
