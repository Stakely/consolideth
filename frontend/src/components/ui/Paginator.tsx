import { FC, JSX, ReactNode, useState } from 'react';
import { Pagination, PaginationItem } from '@mui/material';
import { useTheme } from '@/providers/theme-provider';
import { Flex, Icon } from '@/components';

type PaginatorProps = {
  /**
   * Array of JSX elements to be paginated.
   * These elements will be divided across multiple pages based on `itemsPerPage`.
   */
  elements: JSX.Element[];

  /**
   * Number of items to display per page.
   * Determines how many elements are visible at a time.
   */
  itemsPerPage: number;

  /**
   * Background color of the selected (active) pagination button.
   * Accepts any valid CSS color value.
   */
  selectedPageBgColor?: string;

  /**
   * Text color of the selected (active) pagination button.
   * Accepts any valid CSS color value.
   */
  selectedPageColor?: string;

  /**
   * Background color applied when hovering over a pagination button.
   * Accepts any valid CSS color value.
   */
  hoverColor?: string;

  /**
   * Default text color of pagination buttons.
   * Accepts any valid CSS color value.
   */
  textColor?: string;

  /**
   * Callback to be executed in every page change
   */
  onPageChange?: (page: number) => void;

  /**
   * Forces the current page
   */
  page?: number;
};

/**
 * Returns a component that provides pagination functionality for an array of elements.
 * Its displays a subset of elements based on the current page and items per page.
 *
 */
export const Paginator: FC<PaginatorProps> = ({
  elements,
  itemsPerPage,
  selectedPageBgColor,
  selectedPageColor,
  hoverColor,
  textColor,
  onPageChange,
  page,
}: PaginatorProps): ReactNode => {
  const { colors } = useTheme();
  const [currentPage, setCurrentPage] = useState<number>(page ?? 1);

  const getPagesCount = (): number => {
    return Math.ceil(elements.length / itemsPerPage);
  };

  const getVisibleElements = (): Array<JSX.Element> => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return elements.slice(startIndex, endIndex);
  };

  const RightIconComponent = () => {
    return (
      <Icon
        name={'rightArrowCircle'}
        size={'30px'}
        clickable
        onHoverColor={colors.background['00']}
      />
    );
  };

  const LeftIconComponent = () => {
    return (
      <Icon
        name={'rightArrowCircle'}
        rotation={180}
        size={'30px'}
        clickable
        onHoverColor={colors.background['00']}
      />
    );
  };

  return (
    <Flex width={'100%'} items={'center'} spacing={'10px'}>
      {getVisibleElements()}
      <Pagination
        page={currentPage}
        shape={'rounded'}
        count={getPagesCount()}
        onChange={(_, page) => {
          setCurrentPage(page);
          onPageChange?.(page);
        }}
        sx={{
          '& .MuiPaginationItem-root': {
            color: textColor ?? colors.background['00'],
            fontFamily: 'Plus Jakarta Sans',
            fontSize: '18px',
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: selectedPageBgColor ?? colors.background['00'],
            color: selectedPageColor ?? colors.background['04'],
            fontWeight: 700,
          },
          '& .MuiPaginationItem-root.Mui-selected:hover': {
            fontWeight: 700,
            backgroundColor: hoverColor ?? colors.primary['02'],
          },
          '& .MuiPaginationItem-root:hover': {
            backgroundColor: hoverColor ?? colors.primary['02'],
          },
        }}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: LeftIconComponent, next: RightIconComponent }}
            {...item}
          />
        )}
      />
    </Flex>
  );
};
