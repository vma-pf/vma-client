"use client";
import React, { useEffect, useRef, useState } from "react";
// import file from "../../../public/videos/file_example.mp4";
// ffmpeg -i rtsp://admin:minhdat0805@192.168.1.2:554/onvif1 -c:v copy -f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments stream.m3u8
// ffmpeg -i rtsp://admin:minhdat0805@192.168.1.2:554/onvif1 -hls_time 2 -hls_list_size 3 -f hls D:\index.m3u8
// ffmpeg -i rtsp://admin:minhdat0805@192.168.1.2:554/onvif1 -fflags flush_packets -max_delay 2 -flags -global_header -hls_time 2 -hls_list_size 3 -vcodec copy -y ./index.m3u8
const Demo = () => {
  return (
    <div>
      <h1>Live Stream</h1>
    </div>
  );
};

export default Demo;
