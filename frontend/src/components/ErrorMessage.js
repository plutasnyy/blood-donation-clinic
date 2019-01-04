import React from 'react'
import {Message} from "semantic-ui-react";

export const ErrorMessage = ({error}) => {
    return (
        <div>
            {error === true ?
                <Message
                    error
                    header='You are trying to do something forbidden.'
                    list={['Find if it is not a foreign key for other object']}
                />  
                : null}
        </div>
    )
};