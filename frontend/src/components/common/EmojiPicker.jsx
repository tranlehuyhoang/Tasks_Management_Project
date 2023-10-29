
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Box, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'

const EmojiPicker = ({ icon, onChange }) => {
    const [selectedEmoji, setSelectedEmoji] = useState()
    const [isShowPicker, setIsShowPicker] = useState(false)

    useEffect(() => {
        setSelectedEmoji(icon)
    }, [icon])

    const selectEmoji = (e) => {
        console.log('faewfafe')
        const sym = e.unified.split('-')
        let codesArray = []
        sym.forEach(el => codesArray.push('0x' + el))
        const emoji = String.fromCodePoint(...codesArray)
        console.log(emoji)
        setIsShowPicker(false)
        onChange(emoji)
    }
    const showPicker = () => {

        setIsShowPicker(!isShowPicker);
    }


    return (
        <Box sx={{ position: 'relative', width: 'max-content' }}>
            <Typography
                variant='h4'
                fontWeight='700'
                sx={{ cursor: 'pointer' }}
                onClick={showPicker}
            >
                {selectedEmoji}
            </Typography>
            <Box sx={{
                display: isShowPicker ? 'block' : 'none',
                position: 'absolute',
                top: '100%',
                zIndex: '9999'
            }}>
                <Picker theme='dark' onEmojiSelect={selectEmoji} showPreview={false} />
            </Box>
        </Box>
    )
};

export default EmojiPicker;