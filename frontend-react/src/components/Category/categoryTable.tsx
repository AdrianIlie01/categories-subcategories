import React, {useCallback, useEffect, useMemo, useState} from 'react';
import MaterialReactTable, {
    MaterialReactTableProps,
    type MRT_ColumnDef,
    type MRT_ColumnFiltersState,
    type MRT_PaginationState,
    type MRT_SortingState,
} from 'material-react-table';
import axios from 'axios';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Tooltip
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {apiUrl} from '../../environment/config';

type Category = {
    id: number;
    category_name: string;
    description: string;
};

interface CreateModalProps {
    columns: MRT_ColumnDef<Category>[];
    onClose: () => void;
    onSubmit: (values: Category) => void;
    open: boolean;
}

const CategoryTable = () => {
    const [data, setData] = useState<Category[]>([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);

    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
        [],
    );
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchData = async () => {
        if (!data.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }

        const url = new URL(
            '/category', apiUrl,
        );
        url.searchParams.set(
            'page',
            `${pagination.pageIndex * pagination.pageSize}`,
        );
        url.searchParams.set('size', `${pagination.pageSize}`);
        url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
        url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

        console.log(url);
        console.log(url.href);
        console.log(data);
        try {
            // const response = await fetch(url);
            const response = await axios.get(url.href)
                .then((response) => {
                    return response;
                })
                .catch((e) => {
                    throw e;
                });
            console.log('response');
            console.log(response);
            console.log(response.data);

            setData(response.data);
            setRowCount(response.data.length);

            // setData(json.data);
            // setRowCount(json.meta.totalRowCount);
        } catch (error) {
            setIsError(true);
            console.error(error);
            return;
        }
        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);
    };

    useEffect(() => {
        fetchData().then(response => response);
    }, [
        columnFilters,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
    ]);

    const columns = useMemo<MRT_ColumnDef<Category>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
            }, {
                accessorKey: 'category_name',
                header: 'Category Name',
            },
            {
                accessorKey: 'description',
                header: 'Description',
            },
        ],
        [],
    );

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<Category[]>(() => data);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});
    const handleCancelRowEdits: any = () => {
        setValidationErrors({});
    };

    const handleSaveRowEdits: MaterialReactTableProps<Category>['onEditingRowSave'] =
        async ({exitEditingMode, row, values}) => {
            if (!Object.keys(validationErrors).length) {
                tableData[row.index] = values;

                //send/receive api updates here, then refetch or update local table data for re-render
                setTableData([...tableData]);

                const url = new URL(
                    `/category/${row.original.id}`,
                    apiUrl,
                );

                try {
                    await axios.patch(url.href, values);
                    await fetchData();
                } catch (error) {
                    console.error(error);
                    return;
                }
                exitEditingMode(); //required to exit editing mode and close modal
            }
        };

    const handleDeleteRow = useCallback(
        async (row: any) => { // of type Category without id
            console.log(row);
            if (
                !window.confirm(`Are you sure you want to delete category ${row.original.category_name}`)
            ) {

                    return;
            }
            //send api delete request here, then refetch or update local table data for re-render
            const url = new URL(
                `/category/${row.original.id}`,
                apiUrl,
            );

            try {
                const response = await axios.delete(url.href);
                // refetch data
                await fetchData();
                console.log(response);
            } catch (error) {
                console.error(error);
                return;
            }
        },
        [
            columnFilters,
            pagination.pageIndex,
            pagination.pageSize,
            sorting,
            tableData
        ],
    );

    const handleCreateNewRow = async (values: Category) => {
        const url = new URL(
            `/category`,
            apiUrl,
        );

        try {
            await axios.post(url.href, values);
            await fetchData();
        } catch (error) {
            console.error(error);
            return;
        }
    };

    return (
        <>
            <MaterialReactTable
                enableGlobalFilter={false} //disable search feature
                columns={columns}
                data={data}
                getRowId={(row) => row.category_name}
                initialState={{ showColumnFilters: true }}
                manualFiltering
                manualPagination
                manualSorting
                muiToolbarAlertBannerProps={
                    isError
                        ? {
                            color: 'error',
                            children: 'Error loading data',
                        }
                        : undefined
                }
                onColumnFiltersChange={setColumnFilters}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                rowCount={rowCount}
                state={{
                    columnFilters,
                    isLoading,
                    pagination,
                    showAlertBanner: isError,
                    showProgressBars: isRefetching,
                    sorting,
                }}
                editingMode="modal" //default
                enableColumnOrdering
                enableEditing
                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
                positionActionsColumn={'last'}
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Tooltip arrow placement="left" title="Edit">
                            <IconButton onClick={() => table.setEditingRow(row)}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Delete">
                            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Button
                        color="secondary"
                        onClick={() => setCreateModalOpen(true)}
                        variant="contained"
                    >
                        Create New Category
                    </Button>
                )}
            />
            <CreateNewCategoryModal
                columns={columns}
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
            />
        </>
    );
};

export const CreateNewCategoryModal = ({
                                   open,
                                   columns,
                                   onClose,
                                   onSubmit,
                               }: CreateModalProps) => {
    const [values, setValues] = useState<any>(() =>
        columns.reduce((acc: any, column: any) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {} as any),
    );

    const handleSubmit = () => {
        //put your validation logic here
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Create New Category</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            mt: 2,
                            width: '100%',
                            minWidth: {xs: '300px', sm: '360px', md: '400px'},
                            gap: '1.5rem',
                        }}
                    >
                        {columns.map((column) => (
                            <TextField
                                // sx={{ mt: 2 }}
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) =>
                                    setValues({...values, [e.target.name]: e.target.value})
                                }
                            />
                        ))}
                    </Stack>

                </form>
            </DialogContent>
            <DialogActions sx={{p: '1.25rem'}}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Create New Category
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CategoryTable;



