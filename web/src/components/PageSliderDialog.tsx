// SPDX-FileCopyrightText: 2025 mtgto <hogerappa@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import { use, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '@mui/material/Input';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { message } from '../message';

type Props = {
  readonly open: boolean;
  readonly currentPageIndex: number;
  readonly pageCount: number;
  readonly onClose: (pageIndex?: number) => void;
};

const PageSliderDialog = (props: Props) => {
  const [pageIndex, setPageIndex] = useState(props.currentPageIndex);
  const handleSliderChange = (_: Event, newValue: number) => {
    setPageIndex(newValue);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageIndex(event.target.value === "" ? 0 : Number(event.target.value));
  };
  const handleCancel = () => {
    props.onClose();
    setPageIndex(props.currentPageIndex); // Reset for opening this dialog in next
  };

  const handleOK = () => {
    props.onClose(pageIndex);
  };

  return (
    <Dialog open={props.open} maxWidth="xs" fullWidth>
      <DialogTitle>{message.choosePageDialog.title}</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2}>
          <Slider
            defaultValue={props.currentPageIndex}
            value={pageIndex}
            onChange={handleSliderChange}
            valueLabelDisplay="on"
            min={1}
            max={props.pageCount}
            marks={[
              { value: 1, label: "1" },
              { value: props.pageCount, label: `${props.pageCount}` },
            ]}
          />
          <Input
            sx={{ width: 64 }}
            size="small"
            value={pageIndex.toString()}
            onChange={handleInputChange}
            inputProps={{ type: "number", min: 1, max: props.pageCount }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>
          {message.choosePageDialog.cancel}
        </Button>
        <Button onClick={handleOK}>
          {message.choosePageDialog.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PageSliderDialog;
