import {Badge, Box, Button, createStyles, Group, Image, Stack, Text, Title} from "@mantine/core";
import { getItemImagePath, getItemPrice } from "../../utils/item";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { Blackmarket } from "../../interfaces/database/blackmarket";
import { useInterval } from "@mantine/hooks";
import { RarityLabels } from "../../interfaces/database/item";
import { getConditionText } from "../../utils/number";
import { RPC } from "../../interfaces/rpc";


const useStyles = createStyles((theme) => ({
    item: {
        padding: theme.spacing.xs,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        '&:hover': {
            cursor: 'pointer'
        }
    },
}));
export function BlackMarketWidget() {
    const { classes } = useStyles();
    const rpc = useOutletContext<RPC>();
    const [items, setItems] = useState<Blackmarket[]>([]);


    const syncData = useInterval(async () => {
        const token = localStorage.getItem('token');
        if ( !token ) return;

        const data = await rpc.market.all();
        if ( !data ) return;
        setItems(data);
    }, 1500);


    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem('token');
            if ( !token ) return;

            const data = await rpc.market.all();
            if ( !data ) return;
            setItems(data);
        }

        getData();


        syncData.start();
        return syncData.stop;
    }, [])

    return <Stack>
        <Title mt={50} order={2}>Neuste Gegenstände im Schwarzmarkt</Title>
        <Stack>
            { items.map((item, index) => {

                const image = getItemImagePath(item.item.name, item.condition);

                return <Box className={classes.item}>
                    <Group position={"apart"}>
                        <Group>
                            <Image src={image} width={100} />
                            <Stack>
                                <Title lh={0.2}>{item.item.name}</Title>
                                <Text>{getItemPrice(item.item.price, item.condition)} €</Text>
                            </Stack>
                            <Badge color={item.item.rarity === 2 ? 'red' : 'blue'}>{RarityLabels[item.item.rarity]}</Badge>
                            <Badge>{getConditionText(item.condition, item.item.type)}</Badge>
                        </Group>
                        <Button>KAUF</Button>
                    </Group>
                </Box>
            })}

        </Stack>
    </Stack>
}