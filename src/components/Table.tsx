import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Divider, Input, Space, Table } from 'antd'
import type {
  TableColumnsType,
  TableProps,
  CheckboxOptionType,
  InputRef,
  TableColumnType,
} from 'antd'
import { data } from './data'
import { isAfter } from 'date-fns'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'

interface DataType {
  key: string
  name: string
  age: number
  birthday: Date
}

type DataIndex = keyof DataType

export const TableComponent: FC = () => {
  const onChange: TableProps<DataType>['onChange'] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log('params', pagination, filters, sorter, extra)
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      )
    },
    getCheckboxProps: (record: DataType) => ({
      name: record.name,
    }),
  }

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const columns: TableColumnsType<DataType> = [
    {
      key: '1',
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps('name'),
    },
    {
      key: '2',
      title: 'Age',
      dataIndex: 'age',
      sorter: (a, b) => a.age - b.age,
      ...getColumnSearchProps('age'),
      sortDirections: ['descend', 'ascend'],
    },
    {
      key: '3',
      title: 'Date of Birth',
      dataIndex: 'birthday',
      sorter: {
        compare: (a, b) => (isAfter(a.birthday, b.birthday) ? 1 : -1),
      },
      render: (date: Date) => date.toLocaleDateString(),
      sortDirections: ['descend', 'ascend'],
    },
  ]

  const defaultCheckedList = columns.map((item) => item.key as string)
  const columnsFromStorage: string[] = JSON.parse(
    sessionStorage.getItem('columns')
  )
  const [checkedList, setCheckedList] = useState(
    columnsFromStorage || defaultCheckedList
  )

  useEffect(() => {
    sessionStorage.setItem('columns', JSON.stringify(checkedList))
  }, [checkedList])

  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }))

  const newColumns = columns.map((item) => ({
    ...item,
    hidden: !checkedList.includes(item.key as string),
  }))

  return (
    <>
      <Divider>Columns for displaying</Divider>
      <Checkbox.Group
        value={checkedList}
        options={options as CheckboxOptionType[]}
        onChange={(value) => {
          setCheckedList(value as string[])
        }}
      />
      <Divider />

      <Table
        virtual
        columns={newColumns}
        dataSource={data}
        onChange={onChange}
        scroll={{ y: 600 }}
        rowKey="key"
        pagination={false}
        rowSelection={{
          ...rowSelection,
          columnWidth: 60,
        }}
      />
    </>
  )
}
