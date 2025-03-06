import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import BlockHours from "./BlockHours.tsx";
import BlockSingleDay from "./BlockSingleDay.tsx";
import BlockMultipleDays from "./BlockMultipleDays.tsx";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabPanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabPanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="availability tabs">
                    <Tab label="Block hours" {...a11yProps(0)} />
                    <Tab label="Block single day" {...a11yProps(1)} />
                    <Tab label="Block multiple days" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <BlockHours/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <BlockSingleDay/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <BlockMultipleDays/>
            </CustomTabPanel>
        </Box>
    );
}
