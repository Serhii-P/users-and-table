"use client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Stack, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { useSession } from "next-auth/react";
import {
  useGetEntriesQuery,
  useUpdateEntryMutation,
} from "@/redux/services/tableEntries";

import { capitalizeFirstLetter } from "../../utils/capitaliseFirstLetter";
import DateComponent from "./DateComponent";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { setFieldError, updateTableData } from "@/redux/features/tableSlice";
import { validateField } from "../../utils/validateField";
import { setSaving, setServerError } from "@/redux/features/serviceStatusSlice";

const defaultRows = [
  {
    rowId: "entry1",
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    birthday: "",
  },
  {
    rowId: "entry2",
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    birthday: "",
  },
  {
    rowId: "entry3",
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    birthday: "",
  },
  {
    rowId: "entry4",
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    birthday: "",
  },
  {
    rowId: "entry5",
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    birthday: "",
  },
];

export default function UsersTable() {
  const [userData, setUserData] = useState(defaultRows);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const session = useSession();
  const userEmail = session.data?.user?.email;
  const [updateEntry] = useUpdateEntryMutation();

  const {
    data: tableData,
    error: tableError,
    isLoading: tableDataIsLoading,
    refetch,
  } = useGetEntriesQuery();

  const persistedTableData = useSelector((state) => state.table.content);
  const persistedErrors = useSelector((state) => state.table.errors);
  const isSaving = useSelector((state) => state.status.isSaving);

  const fetchData = async () => {
    if (!isSaving) {
      try {
        await refetch();
      } catch (error) {
        dispatch(setServerError(true));
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [isSaving]);

  const mergeData = (serverData, persistedData) => {
    const persistedDataMap = new Map(
      persistedData.map((entry) => [entry.rowId, entry])
    );

    const mergedData = defaultRows.map((defaultRow) => {
      const persistedEntry = persistedDataMap.get(defaultRow.rowId);
      const serverEntry = serverData.find(
        (entry) => entry.rowId === defaultRow.rowId
      );
      return persistedEntry || serverEntry || defaultRow;
    });

    return mergedData;
  };

  const debouncedSaveData = useCallback(
    debounce(async (rowId, entry) => {
      dispatch(setSaving(true));
      try {
        await updateEntry({ userEmail, rowId, entry }).unwrap();
      } catch (error) {
        console.log("err in debounce");
      } finally {
        dispatch(setSaving(false));
      }
    }, 1000),
    [updateEntry]
  );

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      const serverEntries =
        tableData && tableData.length > 0 ? tableData[0].entries : [];
      const mergedData = mergeData(serverEntries, persistedTableData);

      setUserData(mergedData);
      setErrors(persistedErrors);
    }
  }, [tableData, persistedTableData, persistedErrors]);

  const handleUserDataChange = (index, field, value) => {
    let updatedValue = value;

    if (field === "firstName" || field === "lastName") {
      updatedValue = capitalizeFirstLetter(value);
    }

    if (field === "birthday") {
      const date = dayjs(value);
      updatedValue = date.isValid() ? date.toISOString() : "";
    }

    const isValid = validateField(field, updatedValue);

    dispatch(setFieldError({ index, field, error: !isValid }));

    const updatedEntry = { ...userData[index], [field]: updatedValue };
    const updatedUserData = userData.map((item, i) =>
      i === index ? updatedEntry : item
    );

    setUserData(updatedUserData);
    dispatch(
      updateTableData({ rowId: updatedEntry.rowId, entry: updatedEntry })
    );

    if (isValid) {
      debouncedSaveData(updatedEntry.rowId, updatedEntry);
    } else {
      console.log("validate error");
    }
  };

  if (tableDataIsLoading) {
    return (
      <Stack direction="row" justifyContent="center">
        Loading...
      </Stack>
    );
  }

  if (tableError) {
    return (
      <Stack direction="row" justifyContent="center">
        Error: {tableError.message}
      </Stack>
    );
  }
  return (
    <TableContainer
      component={Paper}
      style={{ maxWidth: "1000px", margin: "0 auto" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Birthday</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userData.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={user.id}
                  onChange={(e) =>
                    handleUserDataChange(index, "id", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={user.email}
                  onChange={(e) =>
                    handleUserDataChange(index, "email", e.target.value)
                  }
                  InputProps={{
                    style: {
                      color:
                        errors && errors[index] && errors[index]?.email
                          ? "red"
                          : undefined,
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={user.firstName}
                  onChange={(e) =>
                    handleUserDataChange(index, "firstName", e.target.value)
                  }
                  InputProps={{
                    style: {
                      color:
                        errors && errors[index] && errors[index]?.firstName
                          ? "red"
                          : undefined,
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={user.lastName}
                  onChange={(e) =>
                    handleUserDataChange(index, "lastName", e.target.value)
                  }
                  InputProps={{
                    style: {
                      color:
                        errors && errors[index] && errors[index]?.lastName
                          ? "red"
                          : undefined,
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <DateComponent
                  value={dayjs(user.birthday)}
                  onChange={(date) => {
                    handleUserDataChange(index, "birthday", date);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
