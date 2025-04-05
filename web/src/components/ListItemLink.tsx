// SPDX-FileCopyrightText: 2020 mtgto <hogerappa@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link as RoconLink } from "rocon/react";
import { collectionRoutes, filterRoutes } from "./Routes.tsx";

type Props = {
  primary: string;
  route: typeof collectionRoutes.route | typeof filterRoutes.route;
  match: { readonly id: string, readonly page?: string };
};

const ListItemLink = (props: Props) => (
  <ListItemButton component={RoconLink<Props["match"]>} route={props.route} match={props.match}>
    <ListItemText primary={props.primary} />
  </ListItemButton>
);

export default ListItemLink;
