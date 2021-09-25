import React, { useState } from 'react';
import { Descriptions, Switch } from 'antd';

const mapKeyValuesToArray = (values: Array<any>, ignoreList: Array<any>) => {
    return Object.entries(values || {})
        .filter(([key]) => !ignoreList.includes(key))
        .map(([key, value]) => {
            return { key, value };
        });
};

interface KeyValueProps {
    values?: any;
    ignoreList?: Array<any>;
    title: string;
}

export const KeyValues = ({ values = {}, ignoreList = [], title }: KeyValueProps) => {
    const original = mapKeyValuesToArray(values, ignoreList);
    const compact = original.slice(0, 5);
    const overflow = compact.length < original.length;

    const [showAll, setState] = useState(!overflow);
    const showToggle = overflow ? (
        <Switch
            checkedChildren="Compact"
            unCheckedChildren="Show All"
            checked={showAll}
            onChange={() => setState(!showAll)}
        />
    ) : null;

    const descs = showAll ? original : compact;

    if (original.length === 0) {
        return null;
    }

    const mapValues = (values: Array<any>): string => {
        return values
            .map((val) => {
                return Object.values(val).join(',');
            })
            .join(',');
    };

    return (
        <Descriptions bordered size="small" extra={showToggle} title={title} style={{ padding: '10px 0' }}>
            {descs.map((v) => (
                <Descriptions.Item label={v.key} key={v.key} span={3}>
                    {Array.isArray(v.value) ? mapValues(v.value) : v.value}
                </Descriptions.Item>
            ))}
        </Descriptions>
    );
};
