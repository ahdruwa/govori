import { Grid } from '@material-ui/core';
import React, {
	memo,
	ReactChild,
	ReactNode,
	ReactNodeArray,
	useEffect,
	useRef,
} from 'react';

type Props = {
	children?: ReactNode | ReactNodeArray;
};

const RoomVideo = ({ children }: Props) => {
	let row: ReactNode[] = [];
	const rows: ReactNode[][] = [];

	if (Array.isArray(children)) {
		children?.forEach((node) => {
			row.push(node);

			if (row.length > rows.length + 1) {
				rows.push(row);
				row = [];
			}
		});
	} else {
		row.push(children);
	}

	rows.push(row);

	return (
		<>
			{rows.map((_row, rowId) => {
				return (
					<Grid
						key={rowId}
						container
						justify="center"
						item-aligment="center"
						direction="row"
						spacing={5}
					>
						{_row.map((node, nodeId) => {
							return (
								<Grid xs={6} key={`${nodeId}-${rowId}`} item>
									{node}
								</Grid>
							);
						})}
					</Grid>
				);
			})}
		</>
	);
};

RoomVideo.defaultProps = {
	children: null,
};

export default RoomVideo;
