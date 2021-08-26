import React, {useState, forwardRef, useImperativeHandle, useEffect} from "react";
import {useForm, usePage} from "@inertiajs/inertia-react";
import {makeStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

// Dialog
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "auto"
    },
    paper: {
        width: 200,
        height: 230,
        overflow: "auto"
    },
    button: {
        margin: theme.spacing(0.5, 0)
    }
}));

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

const Permissions = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        showPermissions(user) {
            handleOpen();
            data.id = user.id;

            console.log(user);

            user.permissions.map((permission) => {
                right.push(permission.id);
            });

            permissions.map((permission, index) => {
                if (!right.includes(permission.id)) {
                    left.push(permission.id);
                }
            });
        }
    }));

    const {permissions} = usePage().props;
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors
    } = useForm({id: null, permissions: []});

    const handleOpen = () => {
        setOpen(true);
        clearErrors();
    };

    const handleClose = () => {
        setOpen(false);
        reset();
        setRight([]);
        setLeft([]);
        setError(false);
    };

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        setError(false);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };
    const handleSubmitForm = (event) => {
        event.preventDefault();

        data.permissions = right;
        post(route("permisos.assign", data.id), {
            onSuccess: () => {
                handleClose();
            },
            onError: (error) => console.log(error)
        });
    };


    const customList = (items) => (
        <Paper className={
            classes.paper
        }>
            <List dense component="div" role="list">
                {
                items.map((value) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItem key={value}
                            role="listitem"
                            button
                            onClick={
                                handleToggle(value)
                        }>
                            <ListItemIcon>
                                <Checkbox checked={
                                        checked.indexOf(value) !== -1
                                    }
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={
                                        {"aria-labelledby": labelId}
                                    }/>
                            </ListItemIcon>
                            <ListItemText id={labelId}
                                primary={
                                    permissions.filter((permission) => permission.id == value).map((filteredPermission) => {
                                        return filteredPermission.name;
                                    })
                                }/>
                        </ListItem>
                    );
                })
            }
                <ListItem/>
            </List>
        </Paper>
    );

    return (
        <>
            <div className="flex justify-between w-full items-center">
                <Dialog open={open}
                    maxWidth="lg">
                    <DialogTitle id="form-dialog-title">
                        Asignar Permisos
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Ingrese los datos del rol correctamente:
                        </DialogContentText>
                        {
                        errors.permissions && (
                            <p className="text-red-500 font-bold text-sm">
                                {" "}
                                Tiene que ingresar al menos un permiso
                            </p>
                        )
                    }

                        <div className="grid sm:grid-cols-3 gap-2 justify-items-center">
                            <div>
                                <p className="text-center text-gray-500 font-bold m-2">
                                    Lista de Permisos
                                </p>
                                {
                                customList(left)
                            } </div>
                            <div className="flex flex-col justify-center items-center">
                                <Button variant="outlined" size="small"
                                    className={
                                        classes.button
                                    }
                                    onClick={handleAllRight}
                                    disabled={
                                        left.length === 0
                                    }
                                    aria-label="move all right">
                                    Asignar todos
                                </Button>
                                <Button variant="outlined" size="small"
                                    className={
                                        classes.button
                                    }
                                    onClick={handleCheckedRight}
                                    disabled={
                                        leftChecked.length === 0
                                    }
                                    aria-label="move selected right">
                                    Asignar Seleccionados
                                </Button>
                                <Button variant="outlined" size="small"
                                    className={
                                        classes.button
                                    }
                                    onClick={handleCheckedLeft}
                                    disabled={
                                        rightChecked.length === 0
                                    }
                                    aria-label="move selected left">
                                    Quitar Seleccionados
                                </Button>
                                <Button variant="outlined" size="small"
                                    className={
                                        classes.button
                                    }
                                    onClick={handleAllLeft}
                                    disabled={
                                        right.length === 0
                                    }
                                    aria-label="move all left">
                                    Quitar todos
                                </Button>
                            </div>
                            <div>
                                <p className="text-center text-gray-500 font-bold m-2">
                                    Permisos Asignados
                                </p>
                                {
                                customList(right)
                            } </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button className="focus:outline-none" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button  className="focus:outline-none" onClick={handleSubmitForm}
                            disabled={processing}>
                            Enviar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
});

export default Permissions;
