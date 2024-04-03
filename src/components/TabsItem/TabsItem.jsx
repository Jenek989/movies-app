import { Tabs } from 'antd';

import './TabsItem.css';

const TabsItem = ({ tabKey, handleTabChange }) => {
  const tabsItems = [
    {
      label: 'Search',
      key: '1',
    },
    {
      label: 'Rated',
      key: '2',
    },
  ];

  return (
    <Tabs className="tabs" activeKey={tabKey} centered size="large" items={tabsItems} onTabClick={handleTabChange} />
  );
};

export default TabsItem;
