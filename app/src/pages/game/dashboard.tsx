import {Card, Grid, Stack, Table, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import {getShort, randomIP} from "../../utils/number";
import {formatDateTime} from "../../utils/date";
import {getRandomUserAgent} from "../../utils/string";
import {BlackMarketWidget} from "../../components/widgets/blackmarket";
import {useOutletContext} from "react-router-dom";
import {RPC} from "../../interfaces/rpc";
import {User} from "../../interfaces/database/user";
import {Hack} from "../../interfaces/database/hack";
import {useGame} from "../../providers/game";

export function Dashboard() {
    const { rpc } = useGame();

    const [user, setUser] = useState<User>();
    const [lastHacks, setLastHacks] = useState<Hack[]>([]);

    useEffect(() => {
        const getData = async () => {
            if ( !rpc ) return;

            //setUser(await rpc.user.getData(localStorage.getItem('token') as string));

            const dbLastHacks = await rpc.user.getHacks(localStorage.getItem('token') as string, 10);
            if ( typeof(dbLastHacks) === "string") return;
            setLastHacks(dbLastHacks);
        }
        getData();
    }, [rpc]);

    return (
        <Stack>
            <Title align={"center"} lh={0.5} mt={10}>Willkommen zurück, {user?.username}</Title>
            <Title align={"center"} lh={0.7} order={2}>ein guter Tag zum Hacken!</Title>

            <Grid grow mt={50}>
                <Grid.Col span={2}>
                    <Card radius={"md"} ta={"center"} shadow="lg" p={"lg"}>
                        <Card.Section py={20}>
                            <Title align={"center"} order={4}>{getShort(Number(6332915252999))}</Title>
                            <Title align={"center"} order={6}>hacks</Title>
                        </Card.Section>
                    </Card>
                </Grid.Col>
                <Grid.Col span={2}>
                    <Card radius={"md"} ta={"center"} shadow="lg" p={"lg"}>
                        <Card.Section py={20}>
                            { lastHacks[0] &&
                                <Title align={"center"} order={4}>{formatDateTime(lastHacks[0]?.created)}</Title>
                            }
                            <Title align={"center"} order={6}>letzter hack</Title>
                        </Card.Section>
                    </Card>
                </Grid.Col>
                <Grid.Col span={2}>
                </Grid.Col>
                <Grid.Col span={2}>
                </Grid.Col>
            </Grid>

            <BlackMarketWidget />

            <Title mt={50} order={2}>Letzte Hacks</Title>
            <Table striped withBorder withColumnBorders highlightOnHover>
                <thead>
                <tr>
                    <th>Benutzer</th>
                    <th>Datum</th>
                    <th>Agent</th>
                    <th>IP</th>
                    <th>Erhalten</th>
                </tr>
                </thead>
                <tbody>
                {
                    lastHacks.map( (hack, index) => {
                        return <tr key={"hack"+index}>
                            <td>unbekannt</td>
                            <td>{formatDateTime(hack.created)}</td>
                            <td>{getRandomUserAgent()}</td>
                            <td>{randomIP()}</td>
                            <td>{hack.money.toFixed(2)} €</td>
                        </tr>
                    })
                }
                </tbody>
            </Table>
        </Stack>
    );
}