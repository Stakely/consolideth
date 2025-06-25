import { ReactNode, useEffect, useState } from 'react';
import { Percentage, useTheme } from '@/providers/theme-provider';
import {
  Divider,
  Flex,
  Icon,
  Paginator,
  Surface,
  Text,
  useIsMobile,
} from '@/components';

export type TableColumn<T> = {
  /**
   * The key of the property in the data object to display in this column.
   * Acts as a pointer to the value in the data row.
   */
  prop: keyof T;

  /**
   * The label shown as the column header.
   */
  label: string;

  /**
   * Optional custom rendering function for the cell content.
   * Receives the full data row and returns a ReactNode.
   * If not provided, the table displays the raw stringified value.
   */
  render?: (c: T) => ReactNode;

  /**
   * Whether the column is sortable or not.
   * If true, a sorting icon will be shown and clicking it toggles ascending/descending order.
   */
  sortable?: boolean;

  /**
   * Optional column width as a percentage string (e.g., '25%').
   * If not specified, widths are evenly distributed.
   */
  width?: Percentage;

  /**
   * Optional alignment of the content within the column.
   * - 'start' (default): left-aligned.
   * - 'center': centered.
   * - 'end': right-aligned.
   */
  align?: 'start' | 'center' | 'end';
};

type TableProps<T> = {
  /**
   * The array of data items to be rendered in the table.
   */
  data: Array<T>;

  /**
   * Array of column definitions describing how to display the data.
   *
   * Each column must define the `prop` and `label`.
   * Optionally, it can include:
   * - `render`: custom rendering logic for the cell.
   * - `sortable`: if true, adds sorting behavior to the column header.
   * - `width`: sets the column width.
   * - `align`: aligns content within the column.
   *
   * 📌 Special behavior:
   * If an object in `data` includes a function named `onExpand`, the table will render
   * that row inside an `Accordion` and invoke `onExpand(row)` to render nested content.
   * This allows expandable rows with custom detail views.
   */
  columns: Array<TableColumn<T>>;

  /**
   * Number of rows to display per page.
   * If the data exceeds this limit, a paginator will be rendered.
   * Default: 10
   */
  itemsPerPage?: number;

  /**
   * Whether to show the border (divider) after the last row.
   * Default: true
   */
  lastIndexBorder?: boolean;

  isRowSelectable?: (row: T) => boolean;

  isRowSelected?: (row: T) => boolean;

  selectedColor?: string;

  onSelect?: (row: T) => void;

  onPageChange?: (page: number) => void;
  currentPage?: number;
};

export const Table = <T,>({
  data,
  columns,
  itemsPerPage = 10,
  lastIndexBorder = true,
  isRowSelected,
  isRowSelectable,
  selectedColor,
  onSelect,
  onPageChange,
  currentPage,
}: TableProps<T>): ReactNode => {
  const isMobile = useIsMobile();
  const { colors } = useTheme();

  const [sortedData, setSortedData] = useState<Array<T>>(data);
  const [order, setOrder] = useState<'asc' | 'desc' | null>(null);
  const [orderProp, setOrderProp] = useState<keyof T | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    if (order !== null && orderProp !== null) {
      const dataToSort = [...data];
      const sorted = dataToSort.sort((a, b) => {
        if (a[orderProp] < b[orderProp]) return order === 'asc' ? -1 : 1;
        if (a[orderProp] > b[orderProp]) return order === 'asc' ? 1 : -1;
        return 0;
      });

      setSortedData(sorted);
    } else {
      setSortedData(data);
    }
  }, [JSON.stringify(data)]);

  const onSortColumnClicked = (prop: keyof T, forceOder?: 'asc' | 'desc') => {
    const dataToSort = [...sortedData];
    const newOrder = forceOder ? forceOder : order === 'asc' ? 'desc' : 'asc';
    setOrder(newOrder);

    const sorted = dataToSort.sort((a, b) => {
      if (a[prop] < b[prop]) return newOrder === 'asc' ? -1 : 1;
      if (a[prop] > b[prop]) return newOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setSortedData(sorted);
    setOrderProp(prop);
  };

  const getColumnWidth = (column: TableColumn<T>): Percentage => {
    if (column.width) {
      return column.width;
    }

    return `${100 / columns.length}%`;
  };

  const getColumnAlignment = (
    column: TableColumn<T>
  ): 'end' | 'center' | 'start' => {
    if (column.align) {
      return column.align;
    }

    return 'start';
  };

  const renderCell = (data: T, column: TableColumn<T>): ReactNode => {
    if (column.render) {
      return column.render(data);
    }

    return (
      <Text
        content={String(data[column.prop])}
        alt={String(data[column.prop])}
      />
    );
  };

  const renderRows = () => {
    const isHovered = (key: string) => {
      return hoveredKey === key;
    };

    return sortedData.map((d, d_idx) => (
      <div
        onMouseEnter={() => setHoveredKey(`r-${d_idx}`)}
        onMouseLeave={() => setHoveredKey(null)}
        onClick={() => {
          if (isRowSelectable?.(d)) {
            onSelect?.(d);
          }
        }}
        style={{
          cursor: isRowSelectable?.(d) ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          boxSizing: 'border-box',
          background: isRowSelected?.(d)
            ? selectedColor
            : isRowSelectable?.(d) && isHovered(`r-${d_idx}`)
              ? 'rgba(255,255,255,0.1)'
              : 'transparent',
        }}
        key={`r-${d_idx}`}
      >
        {!Object.prototype.hasOwnProperty.call(d, 'onExpand') &&
          renderCells(d, d_idx)}
        {(lastIndexBorder || d_idx !== sortedData.length - 1) && (
          <Divider
            color={colors.background['03']}
            opacity={0.5}
            thickness={'1px'}
          />
        )}
      </div>
    ));
  };

  const renderCells = (d: T, d_idx: number) => {
    return (
      <Flex width={'100%'} direction={'row'} padding={'16px 0'}>
        {columns.map((c, c_idx) => (
          <Flex
            key={`d-${d_idx}-c-${c_idx}`}
            width={getColumnWidth(c)}
            direction={'row'}
            content={getColumnAlignment(c)}
            items={'center'}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {renderCell(d, c)}
            </div>
          </Flex>
        ))}
      </Flex>
    );
  };

  const renderMobileRows = () => {
    return sortedData.map((d, d_idx) => (
      <Surface
        key={`r-${d_idx}`}
        width={'100%'}
        padding={'6px 10px'}
        opacity={0.4}
      >
        {!Object.prototype.hasOwnProperty.call(d, 'onExpand') &&
          renderMobileCells(d, d_idx)}
        {(lastIndexBorder || d_idx !== sortedData.length - 1) && (
          <Divider
            color={colors.background['03']}
            opacity={0.5}
            thickness={'1px'}
          />
        )}
      </Surface>
    ));
  };

  const renderMobileCells = (d: T, d_idx: number) => {
    return (
      <Flex
        width={'100%'}
        direction={'column'}
        padding={'16px 0'}
        spacing={'20px'}
      >
        {columns.map((c, c_idx) => (
          <Flex
            key={`d-${d_idx}-c-${c_idx}`}
            width={'100%'}
            direction={'row'}
            content={'start'}
            items={'center'}
            spacing={'10px'}
          >
            <Text weight={700} content={`${c.label ? c.label + ':' : ''}`} />
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {renderCell(d, c)}
            </div>
          </Flex>
        ))}
      </Flex>
    );
  };

  const getSortIcon = (c: TableColumn<T>) => {
    const isActive = c.prop === orderProp;

    if (isActive) {
      if (order === 'asc') {
        return (
          <Icon
            name={'leftArrow'}
            rotation={90}
            color={colors.primary['02']}
            size={'18px'}
            clickable
            onClick={() => onSortColumnClicked(c.prop)}
          />
        );
      }

      return (
        <Icon
          name={'leftArrow'}
          color={colors.primary['02']}
          size={'18px'}
          rotation={270}
          clickable
          onClick={() => onSortColumnClicked(c.prop)}
        />
      );
    }

    return (
      <Icon
        name={'arrows'}
        size={'14px'}
        clickable
        onClick={() => onSortColumnClicked(c.prop)}
      />
    );
  };

  return isMobile ? (
    renderMobileRows()
  ) : (
    <Flex width={'100%'}>
      {/* Render Headers*/}
      <Flex width={'100%'} direction={'row'} padding={'0 0 16px 0'}>
        {columns.map((c) => (
          <Flex
            key={`t-${c.prop.toString()}`}
            width={getColumnWidth(c)}
            direction={'row'}
            content={getColumnAlignment(c)}
            items={'center'}
            spacing={'4px'}
          >
            {c.sortable && getSortIcon(c)}
            <Text color={colors.background['01']} content={c.label} />
          </Flex>
        ))}
      </Flex>
      <Divider
        color={colors.background['03']}
        opacity={0.5}
        thickness={'1px'}
      />
      {/* Render cells */}
      {data.length > itemsPerPage && (
        <Paginator
          onPageChange={onPageChange}
          page={currentPage}
          elements={renderRows()}
          itemsPerPage={itemsPerPage}
        />
      )}
      {data.length <= itemsPerPage && renderRows()}
    </Flex>
  );
};
