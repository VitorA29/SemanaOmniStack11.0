import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { View, Image, Text, FlatList, TouchableOpacity } from 'react-native';

import api from '../../services/api';

import styles from './styles';

import logoImg from '../../assets/logo.png';

export default function Incidents() {
    const [ incidents, setIncidents ] = useState([]);
    const [ total, setTotal ] = useState(null);
    const [ page, setPage ] = useState(1);
    const [ loading, setLoading ] = useState(false);

    const navigation = useNavigation();
    const currencyFormatter =  Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    function navigateToDetail(incident) {
        navigation.navigate('Detail', { incident });
    }

    async function loadIncidents() {
        if (loading || (total != null && incidents.length === total)) {
            return;
        }

        setLoading(true);

        const response = await api.get('incidents', {
            params: { page }
        });

        setIncidents([ ...incidents, ...response.data ]);
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        setLoading(false );
    }
    
    useEffect(() => {
        loadIncidents();
    }, []);

    return (
        <View style={ styles.container }>
            <View style={ styles.header }>
                <Image source={ logoImg } />
                <Text style={ styles.headerText }>
                    Total de <Text style={ styles.headerTextBold }>{ total } casos</Text>.
                </Text>
            </View>

            <Text style={ styles.title }>Bem-vindo!</Text>
            <Text style={ styles.description }>Escolha um dos casos abaixo e salve o dia.</Text>

            <FlatList
                data={ incidents }
                style={ styles.incidentsList }
                keyExtractor={ incident => String(incident.id) }
                showsVerticalScrollIndicator={ false }
                onEndReached={ loadIncidents }
                onEndReachedThreshold={ 0.2 }
                renderItem={ ({ item: incident }) => (
                    <View style={ styles.incident }>
                        <Text style={ styles.incidentProperty }>Ong:</Text>
                        <Text style={ styles.incidentValue }>{ incident.name }</Text>

                        <Text style={ styles.incidentProperty }>Caso:</Text>
                        <Text style={ styles.incidentValue }>{ incident.title }</Text>

                        <Text style={ styles.incidentProperty }>Valor:</Text>
                        <Text style={ styles.incidentValue }>{ currencyFormatter.format(incident.value) }</Text>

                        <TouchableOpacity
                            style={ styles.detailButton }
                            onPress={ () => navigateToDetail(incident) }
                        >
                            <Text style={ styles.detailButtonText }>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={ 16 } color="#e02041" />
                        </TouchableOpacity>
                    </View>
                ) }
            />
        </View>
    )
}