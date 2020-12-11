import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function infobox({title, cases, total ,active, isRed, ...props}) {
  return (
    <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}>  
      <CardContent>
        {/* corona virus cases{title} */}
        
        {/* <Typography className="infobox__critical" color="textSecondary">{critical} critical</Typography> */}
        
        <Typography className="infobox__title" color="textSecondary">{title}</Typography>

        {/* +120k{cases} */}
        <h2 className={`infobox__cases ${!isRed && "infobox__cases--green"}`}>{cases}</h2>

        {/* 1.2M{total} */}
        <Typography className="infobox__total" color="textSecondary">Total {total}  </Typography>
      </CardContent>
    </Card>
  );
}

export default infobox;
