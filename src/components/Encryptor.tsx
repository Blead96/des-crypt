import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}));

const pc1 = [
    57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60,
    52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4,
];

const pc2 = [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52,
    31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32,
];

const iterationShifts = {
    0: 1,
    1: 1,
    2: 2,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 1,
    9: 2,
    10: 2,
    11: 2,
    12: 2,
    13: 2,
    14: 2,
    15: 1,
};

const Encryptor = () => {
    const [k64, setK64] = useState("");
    const [k56, setK56] = useState("");

    const [cBlock, setCBlock] = useState("");
    const [dBlock, setDBlock] = useState("");
    const [shift, setShift] = useState(1);
    const [newCBlock, setNewCBlock] = useState("");
    const [newDBlock, setNewDBlock] = useState("");
    const [currIteration, setCurrIteration] = useState(0);
    const [prevCBlock, setPrevCBlock] = useState("");
    const [prevDBlock, setPrevDBlock] = useState("");
    const [prevShift, setPrevShift] = useState(1);
    const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(false);
    const [isUndoBtnDisabled, setIsUndoBtnDisabled] = useState(true);

    const [cD56, setCD56] = useState("");
    const [k48, setK48] = useState("");

    ///////////////////////////////////////////////////////////
    useEffect(() => {
        if (iterationShifts[currIteration]) {
            setShift(iterationShifts[currIteration]);
        } else {
            setShift(1);
        }

        if (currIteration >= 16) {
            setIsNextBtnDisabled(true);
        } else {
            setIsNextBtnDisabled(false);
        }
    }, [currIteration]);

    useEffect(() => {
        setCBlock(k56.substring(0, 28));
        setDBlock(k56.substring(k56.length - 28));
    }, [k56]);

    useEffect(() => {
        setCD56(newCBlock + newDBlock);
    }, [newCBlock, newDBlock]);
    ///////////////////////////////////////////////////////////

    const perm6456 = () => {
        if (!(k64.length < 64)) {
            let result = "";

            for (let i = 0; i < pc1.length; i++) {
                let index = pc1[i];
                result = result + k64[index - 1];
            }

            setK56(result);
        } else {
            console.log("Value Error. String Inputs' lengths are less than 64.");
            setK64("Value Error. Must NOT be less than 64~");
        }
    };
    ///////////////////////////////////////////////////////////
    function leftRotateString(cBlockStr, dBlockStr, shiftValue) {
        const shiftValueC = shiftValue % cBlockStr.length;
        const rotatedCStr = cBlockStr.substring(shiftValueC) + cBlockStr.substring(0, shiftValueC);
        setCBlock(rotatedCStr);
        setNewCBlock(rotatedCStr);

        const shiftValueD = shiftValue % cBlockStr.length;
        const rotatedDStr = dBlockStr.substring(shiftValueD) + dBlockStr.substring(0, shiftValueD);
        setDBlock(rotatedDStr);
        setNewDBlock(rotatedDStr);

        setCurrIteration(currIteration + 1);

        setPrevCBlock(cBlockStr);
        setPrevDBlock(dBlockStr);
        setPrevShift(shiftValue);
        setIsUndoBtnDisabled(false);
    }

    ///////////////////////////////////////////////////////////
    const perm5648 = () => {
        if (!(cD56.length < 56)) {
            let result = "";

            for (let i = 0; i < pc2.length; i++) {
                let index = pc2[i];
                result = result + cD56[index - 1];
            }

            setK48(result);
        } else {
            console.log("Value Error. String Input length is less than 64.");
            setK48("Value Error");
        }
    };
    ///////////////////////////////////////////////////////////

    const moveData12 = () => {
        setCBlock(k56.substring(0, 28));
        setDBlock(k56.substring(k56.length - 28));
    };

    const moveData23 = () => {
        setCD56(newCBlock + newDBlock);
    };

    ///////////////////////////////////////////////////////////
    const isBinary = (input) => /^[01]+$/.test(input);
    const handleInputChangeBinary = (e, setInput) => {
        const inputValue = e.target.value;

        if (isBinary(inputValue) || inputValue === "") {
            setInput(inputValue);
        }
    };

    const clearInput = () => {
        setK64("");
        setK56("");
        resetIteration();
        setCD56("");
        setK48("");
    };

    const resetIteration = () => {
        setCurrIteration(0);
        setShift(1);
        setCBlock("");
        setDBlock("");
        setNewCBlock("");
        setNewDBlock("");

        setPrevCBlock("");
        setPrevDBlock("");
        setPrevShift(1);
        setIsUndoBtnDisabled(true);
    };

    const undoIteration = () => {
        setNewCBlock(cBlock);
        setNewDBlock(dBlock);
        setCBlock(prevCBlock);
        setDBlock(prevDBlock);
        setShift(prevShift);
        setPrevCBlock("");
        setPrevDBlock("");
        setCurrIteration(currIteration - 1);
        setIsUndoBtnDisabled(true);
    };

    return (
        <Container maxWidth="md" className="m-4 p-4 border border-gray-300 rounded">
            <Typography variant="h3" gutterBottom>
                DES - Step One
            </Typography>

            {/* Part One */}
            <Container maxWidth="sm" style={{ borderTop: "1px solid #ccc", marginTop: "1rem" }}>
                <Typography variant="h4">
                    64-bit to 56-bit Permutator
                    <HtmlTooltip
                        title={
                            <>
                                <Typography color="inherit">Note:</Typography>
                                {
                                    "Make sure to use the 64-bit binary equivalent of the hexadecimal key."
                                }
                            </>
                        }>
                        <Button sx={{ px: 0 }}>
                            <InfoIcon color="info" />
                        </Button>
                    </HtmlTooltip>
                </Typography>

                <TextField
                    label="Enter K (64-bit binary key)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={k64}
                    onChange={(e) => handleInputChangeBinary(e, setK64)}
                    inputProps={{
                        maxLength: 64,
                    }}
                />
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    flexWrap="wrap"
                    my={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={perm6456}
                        sx={{ flexGrow: 0, flexShrink: 0, mb: 1, mr: 1 }}>
                        Get 56-bit Key
                    </Button>
                </Box>
                <Typography variant="body1">K+: {k56}</Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexWrap="wrap"
                    my={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={moveData12}
                        sx={{ flexGrow: 0, flexShrink: 0, mb: 1, mr: 1 }}>
                        <ArrowDownwardIcon />
                    </Button>
                </Box>
            </Container>

            {/* Part Two */}
            <Container maxWidth="sm" style={{ borderTop: "1px solid #ccc", marginTop: "1rem" }}>
                <Typography variant="h4">
                    C<sub>n</sub>-D<sub>n</sub> Blocks Shifter
                    <HtmlTooltip
                        title={
                            <>
                                <Typography color="inherit">Note:</Typography>
                                {
                                    "Simply type the initial pair C0 and D0, then keep pressing the GET button. The shift value automatically changes according to the current iteration "
                                }
                                <em>n</em>
                                {"."}
                            </>
                        }>
                        <Button sx={{ px: 0 }}>
                            <InfoIcon color="info" />
                        </Button>
                    </HtmlTooltip>
                </Typography>
                <TextField
                    label={
                        <span>
                            Enter C<sub>n</sub> (28-bit binary key)
                        </span>
                    }
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={cBlock}
                    onChange={(e) => handleInputChangeBinary(e, setCBlock)}
                    inputProps={{
                        maxLength: 28,
                    }}
                />
                <TextField
                    label={
                        <span>
                            Enter D<sub>n</sub> (28-bit binary key)
                        </span>
                    }
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={dBlock}
                    onChange={(e) => handleInputChangeBinary(e, setDBlock)}
                    inputProps={{
                        maxLength: 28,
                    }}
                />
                <TextField
                    label="Set shift"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={shift}
                    onChange={(e) => setShift(parseInt(e.target.value))}
                />
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    flexWrap="wrap"
                    my={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => leftRotateString(cBlock, dBlock, shift)}
                        disabled={isNextBtnDisabled}
                        sx={{ flexGrow: 0, flexShrink: 0, mb: 1, mr: 1 }}>
                        Get Next Iteration Block
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={resetIteration}
                        sx={{ flexGrow: 0, flexShrink: 0, mb: 1, mr: 1 }}>
                        Reset Iteration
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={undoIteration}
                        disabled={isUndoBtnDisabled}
                        sx={{ flexGrow: 0, flexShrink: 0, mb: 1, mr: 1 }}>
                        Undo Iteration
                    </Button>
                </Box>
                <Typography variant="body1" className="mt-3">
                    Current Iteration: {currIteration}
                </Typography>
                <Typography variant="body1" className="mt-3">
                    C<sub>{currIteration}</sub>: {newCBlock}
                </Typography>
                <Typography variant="body1" className="mt-3">
                    D<sub>{currIteration}</sub>: {newDBlock}
                </Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexWrap="wrap"
                    my={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={moveData23}
                        sx={{ flexGrow: 0, flexShrink: 0, mb: 1, mr: 1 }}>
                        <ArrowDownwardIcon />
                    </Button>
                </Box>
            </Container>

            {/* Part Three */}
            <Container maxWidth="sm" style={{ borderTop: "1px solid #ccc", marginTop: "1rem" }}>
                <Typography variant="h4">
                    56-bit to 48-bit Permutator
                    <HtmlTooltip
                        title={
                            <>
                                <Typography color="inherit">Note:</Typography>
                                {"I don't know what to note here. Chat me for questions~"}
                            </>
                        }>
                        <Button sx={{ px: 0 }}>
                            <InfoIcon color="info" />
                        </Button>
                    </HtmlTooltip>
                </Typography>
                <TextField
                    label={
                        <span>
                            Enter C<sub>n</sub>D<sub>n</sub> (concatenated 56-bit binary key)
                        </span>
                    }
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={cD56}
                    onChange={(e) => handleInputChangeBinary(e, setCD56)}
                    inputProps={{
                        maxLength: 56,
                    }}
                />
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    flexWrap="wrap"
                    my={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={perm5648}
                        sx={{ flexGrow: 0, flexShrink: 0, mb: 1, mr: 1 }}>
                        Get 48-bit Key
                    </Button>
                </Box>
                <Typography variant="body1" className="mt-3">
                    K<sub>n</sub>: {k48}
                </Typography>
            </Container>

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    my: 2,
                }}>
                <Button variant="contained" color="error" onClick={clearInput}>
                    Clear
                </Button>
            </Box>
        </Container>
    );
};

export default Encryptor;
