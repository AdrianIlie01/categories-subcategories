import React, {useCallback, useEffect, useMemo, useState} from 'react';
import MaterialReactTable, {
    MaterialReactTableProps, MRT_Cell,
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

type CategoryLink = {
    id: number;
    category: {
        id: number,
        category_name: string,
        description: string,
    };
    parent: {
        id: number,
        category_name: string,
        description: string,
    };
};

interface CreateModalProps {
    // columns: MRT_ColumnDef<CategoryLink>[];
    onClose: () => void;
    onSubmit: (values: CategoryLink) => void;
    open: boolean;
}

const CategoryLinksTable = () => {
    const [data, setData] = useState<CategoryLink[]>([]);
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
            '/category-links', apiUrl,
        );
        url.searchParams.set(
            'page',
            `${pagination.pageIndex * pagination.pageSize}`,
        );
        url.searchParams.set('size', `${pagination.pageSize}`);
        url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
        url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

        try {
            const response = await axios.get(url.href)
                .then((response) => {
                    return response;
                })
                .catch((e) => {
                    throw e;
                });

            setData(response.data);
            setRowCount(response.data.length);

        } catch (error) {
            setIsError(true);
            console.error(error);
            return;
        }
        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);
    };

    useEffect( () => {
        fetchData().then(response => response);
    }, [
        columnFilters,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
    ]);

    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

    const columns = useMemo<MRT_ColumnDef<CategoryLink>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
            },
            {
                accessorKey: 'parent.category_name',
                header: 'Category name',
            },
            {
                accessorKey: 'category.category_name',
                header: 'Subcategory name',
            },
        ],
        [],
    );

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<CategoryLink[]>(() => data);

    const handleCancelRowEdits: any = () => {
        setValidationErrors({});
    };

    const handleSaveRowEdits: MaterialReactTableProps<CategoryLink>['onEditingRowSave'] =
        async ({exitEditingMode, row, values}) => {
            if (!Object.keys(validationErrors).length) {

                const id = Object.values(values)[0];
                const parent = Object.values(values)[1];
                const category = Object.values(values)[2];

                const formValues = {
                    id: id,
                    category: category,
                    parent: parent
                }

                const url = new URL(
                    `/category-links/${row.original.id}`,
                    apiUrl,
                );

                try {
                    const edit = await axios.patch(url.href, formValues);
                    await fetchData();
                } catch (error) {
                    console.error(error);
                    return;
                }
                exitEditingMode(); //required to exit editing mode and close modal
            }
        };

    const handleDeleteRow = useCallback(
        async (row: any) => { // of type CategoryLinks without id
            console.log(row);
            if (
                !window.confirm(`Are you sure you want to delete category link with id ${row.original.id}`)
            ) {

                return;
            }
            const url = new URL(
                `/category-links/${row.original.id}`,
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

    const handleCreateNewRow = async (values: CategoryLink) => {
        const url = new URL(
            `/category-links`,
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
                getRowId={(row, index) =>  String(index)}
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
                renderRowActions={({ row, table, }) => (
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
                        Create New Category Link
                    </Button>
                )}
            />
            <CreateNewCategoryModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
            />
        </>
    );
};

export const CreateNewCategoryModal = ({
                                           open,
                                           onClose,
                                           onSubmit,
                                       }: CreateModalProps) => {
    const [values, setValues] = useState<any>();

    const handleSubmit = () => {
        //put your validation logic here
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Create New Category Link</DialogTitle>
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
                            <TextField
                                key={'parent'}
                                label={'Category Name'}
                                name={'parent'}
                                onChange={(e) =>
                                    setValues({...values, [e.target.name]: e.target.value})
                                }
                            />
                            <TextField
                                key={'category'}
                                label={'Subcategory Name'}
                                name={'category'}
                                onChange={(e) =>
                                    setValues({...values, [e.target.name]: e.target.value})
                                }
                            />
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{p: '1.25rem'}}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Create New Category Link
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CategoryLinksTable;

//TODOO move actions on the right side