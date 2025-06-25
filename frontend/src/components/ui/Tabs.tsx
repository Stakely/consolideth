import { FC, ReactNode, useState } from 'react';
import { Tab, Tabs as MUITabs } from '@mui/material';
import { useTheme } from '@/providers/theme-provider';

type TabsProps = {
  /**
   * Array of strings representing the labels of each tab.
   * The index in the array corresponds to the tab's position.
   */
  tabs: Array<string>;

  /**
   * Index of the tab that should be selected initially.
   * Defaults to 0 (first tab) if not provided.
   */
  selectedTab?: number;

  /**
   * Callback function triggered when the user selects a different tab.
   * Receives the index of the newly selected tab.
   */
  onChange: (newIndex: number) => void;

  /**
   * Optional color for the bottom border of the tab container.
   * Accepts any valid CSS color. If not set, uses a theme-based default.
   */
  borderColor?: string;

  /**
   * Optional color for the active (selected) tab label and indicator.
   * Accepts any valid CSS color. Falls back to theme's primary color if not set.
   */
  activeColor?: string;

  /**
   * Optional color for the inactive (unselected) tab labels.
   * Accepts any valid CSS color. Falls back to theme's background color if not set.
   */
  inactiveColor?: string;

  /**
   * Optional color for the active tab background.
   * Accepts any valid CSS color. Falls back to transparent if not set.
   */
  activeBgColor?: string;
};

/**
 * Returns a tab navigation component.
 * It allows users to switch between different tabs.
 *
 */
export const Tabs: FC<TabsProps> = ({
  tabs,
  onChange,
  selectedTab = 0,
  borderColor,
  activeColor,
  inactiveColor,
  activeBgColor,
}: TabsProps): ReactNode => {
  const [selectedIdx, setSelectedIdx] = useState<number>(selectedTab);
  const { colors } = useTheme();

  const [hoveredTab, setHoveredTab] = useState<number | null>(selectedTab);

  const isTabHovered = (tabIdx: number): boolean => {
    return hoveredTab === tabIdx;
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedIdx(newValue);
    onChange(newValue);
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        borderBottom: `1px solid ${borderColor ?? colors.background['07']}`,
        zIndex: 0,
      }}
    >
      <MUITabs
        onChange={handleChange}
        value={selectedIdx}
        sx={{
          zIndex: 0,
          '& .MuiTabs-indicator': {
            backgroundColor:
              activeBgColor ?? activeColor ?? colors.primary['02'],
          },
        }}
      >
        {tabs.map((t, i) => (
          <Tab
            onMouseEnter={() => setHoveredTab(i)}
            onMouseLeave={() => setHoveredTab(null)}
            label={t}
            key={i}
            sx={{
              color: isTabHovered(i)
                ? (activeColor ?? colors.primary['02'])
                : (inactiveColor ?? colors.background['00']),
              fontFamily: 'Plus Jakarta Sans',
              textTransform: 'none',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                color: activeColor ?? colors.primary['02'],
                fontWeight: 700,
                backgroundColor: activeBgColor ?? 'transparent',
                borderRadius: '5px 5px 0 0',
                padding: '10px 15px',
              },
            }}
          />
        ))}
      </MUITabs>
    </div>
  );
};
